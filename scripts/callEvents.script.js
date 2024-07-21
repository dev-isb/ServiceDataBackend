require('dotenv').config()
const amiIo = require("ami-io");
const moment = require("moment");
const getTime = () => moment().format('YYYY-MM-DD HH:mm:ss');
const log = console.log;
const axios = require("axios");
const Mutex = require("async-mutex").Mutex;
const mutex = new Mutex();
const calls = {};

const {
    AMI_PORT, AMI_HOST,
    AMI_USER, AMI_PASS,
    WEBHOOK_URL
} = process.env;

log(getTime(), { AMI_PORT, AMI_HOST, AMI_USER, AMI_PASS, WEBHOOK_URL });

const ami = amiIo.createClient({
    port: AMI_PORT, host: AMI_HOST,
    login: AMI_USER, password: AMI_PASS,
    encoding: 'ascii', logger: new amiIo.SilentLogger()
});

ami.on('incorrectServer', () => {
    log(getTime(), "Invalid AMI welcome message. Are you sure if this is AMI?");
    process.exit();
});

ami.on('connectionRefused', () => {
    log(getTime(), "Connection refused.");
    process.exit();
});

ami.on('incorrectLogin', () => {
    log(getTime(), "Incorrect login or password.");
    process.exit();
});

ami.connect(true, 3000);


ami.on('connected', () => {
    log(getTime(), "successfully connected to asterisk ");
    ami.on('event', async (event) => {
        const { incomingData, ...restData } = event;
        if ([
            "Newchannel",
            "Newstate",
            "Hangup",
            "QueueCallerJoin",
            "NewConnectedLine",
            "NewCallerid",
            "AgentCalled",
            "AgentComplete",
            "DialBegin",
            "DialEnd",
            "AgentConnect",
            "QueueCallerAbandon",
            "QueueCallerJoin",
            "QueueMemberStatus",
            "QueueMemberPause"
        ].includes(event.event)) {

            if (event.event === "DialBegin") {
                if (event && event.destcalleridnum) {
                    if (
                        //["macro-dialout-trunk", "macro-dial-one"].includes(event.context)
                        (event.destcontext && event.destcontext.includes("from-trunk-sip")) ||
                        (event.destcontext && event.destcontext.includes("from-internal"))
                    ) {
                        const release = await mutex.acquire();
                        log(getTime(), "call dialed", event.event, ":", JSON.stringify(restData));
                        const { success, data } = await getChannelDetails({ channelId: event.destchannel });
                        if (success) {
                            data.disposition = "DIALED";
                            calls[event.destlinkedid] = { ...data };
                            sendWebhookData({ ...data });
                        }
                        release();
                    }
                }
            }

            if (event.event === "DialEnd" && calls[event.destlinkedid] &&
                (
                    (event.destcontext && event.destcontext.includes("from-trunk-sip")) ||
                    (event.destcontext && event.destcontext.includes("from-internal"))
                )
            ) {
                const release = await mutex.acquire();
                log(getTime(), "call response", event.event, ":", JSON.stringify(restData));
                // const { success, data } = await getChannelDetails({ channelId: event.channel });
                // if (success) {
                const data = { ...calls[event.destlinkedid] };
                data.disposition = event.dialstatus;
                calls[event.destlinkedid] = { ...data };
                if (event.dialstatus === "ANSWER") sendWebhookData({ ...data });
                if (event.dialstatus !== "ANSWER") {
                    delete calls[event.destlinkedid];
                }
                // }
                release();
            }

            if (event.event === "QueueCallerAbandon") {
                const release = await mutex.acquire();
                log(getTime(), "call hangup by caller", event.event, ":", JSON.stringify(restData));
                release();
            }

            if (event.event === "AgentConnect" && calls[event.destlinkedid]) {
                if (event.destcontext === "from-queue") {
                    const release = await mutex.acquire();
                    log(getTime(), "call connected to agent", event.event, ":", JSON.stringify(restData));

                    const { membername, interface: queueInterface } = restData;
                    let agentInterface = queueInterface.split("@")[0];
                    let agentId = agentInterface.split("/")[1];
                    // const { success, data } = await getChannelDetails({ channelId: event.channel });
                    // if (success) {
                    const data = { ...calls[event.destlinkedid] };
                    data.disposition = "CONNECTED";
                    data.agentName = membername || "NONE";
                    data.agentId = agentId || "NONE";
                    data.amdStatus = "HUMAN";
                    calls[event.destlinkedid] = { ...data };
                    sendWebhookData({ ...data });
                    release();
                    // }
                }
            }

            if (event.event === "Hangup" && calls[event.linkedid]) {
                log(getTime(), "call hangup", event.event, ":", JSON.stringify(restData));
                // const { success, data } = await getChannelDetails({ channelId: event.channel });
                // if (success) {
                //if (event.context && event.context.includes("from-queue")) {
                const release = await mutex.acquire();
                const data = { ...calls[event.linkedid] };
                data.disposition = "HANGUP";
                sendWebhookData({ ...data });
                delete calls[event.linkedid];
                release();
                //}
                // }
            }

        }
    });
});


const setVar = async (payload) => {

    const {
        channel,
        keyName,
        keyValue
    } = payload;

    return new Promise((resolve, reject) => {

        const action = new amiIo.Action.SetVar();

        action.Channel = channel;
        action.Variable = keyName;
        action.Value = keyValue;

        ami.send(action, (err, data) => {
            if (err) {
                log(getTime(), channel, "error in setting variable :", keyName, "to value :", keyValue, "error :", err);
                return reject({ success: false, message: "error in getting ami action", data: err });
            }

            if (data.response === "Error") {
                return reject(new Error(data.message));
            }

            const { incomingData, ...restData } = data;
            log(getTime(), channel, "Successfully set variable :", keyName, "to value :", keyValue, "event response :", JSON.stringify(restData));
            return resolve({ success: true, message: "Data Saved Successfully", data: restData });
        });
    });

}

const getVar = async (payload) => {

    const { channel, keyName } = payload;

    return new Promise((resolve, reject) => {

        const action = new amiIo.Action.GetVar();

        action.Channel = channel;
        action.Variable = keyName;

        ami.send(action, (err, data) => {
            if (err) {
                log(getTime(), channel, "error in getting variable :", keyName, "value", "error :", err);
                //return reject({ success: false, message: "error in getting ami action", data: err });
                return reject("NONE");
            }

            if (data.response === "Error") {
                return reject(new Error(data.message));
            }

            const { incomingData, ...restData } = data;
            if (!restData.value || restData.value === "") restData.value = "NONE";
            log(getTime(), channel, "Successfully get variable :", keyName, "with value :", restData.value);
            //return resolve({ success: true, message: "Variable Fetched Successfully", data: restData });
            return resolve(restData.value);
        });
    });

}

const getChannelDetails = async (payload) => {
    const { channelId } = payload;
    const jobId = await getVar({ channel: channelId, keyName: "jobId" });

    if (!jobId || jobId === "NONE") {
        return {
            success: false,
            data: {}
        };
    }

    // const slpId = await getVar({ channel: channelId, keyName: "slpId" });
    const trunk = await getVar({ channel: channelId, keyName: "trunk" });
    const callbackUrl = await getVar({ channel: channelId, keyName: "callbackUrl" });
    const toNumber = await getVar({ channel: channelId, keyName: "toNumber" });
    const fromNumber = await getVar({ channel: channelId, keyName: "fromNumber" });
    const queue = await getVar({ channel: channelId, keyName: "queue" });
    const amdStatus = await getVar({ channel: channelId, keyName: "amdStatus" });

    return {
        success: true,
        data: {
            // slpId,
            jobId,
            trunk,
            callbackUrl,
            toNumber,
            fromNumber,
            queue,
            amdStatus
        }
    };
}

const sendWebhookData = async (payload) => {
    const {
        // slpId,
        jobId,
        trunk,
        callbackUrl,
        toNumber,
        fromNumber,
        queue,
        disposition = "NONE",
        agentName = "NONE",
        amdStatus = "NONE",
        agentId = "NONE"
    } = payload;

    let apiUrl = callbackUrl;

    if (!callbackUrl || callbackUrl == "NONE") {
        apiUrl = WEBHOOK_URL;
    }

    const apiBody = {
        // slpId,
        jobId,
        trunk,
        callbackUrl,
        toNumber,
        fromNumber,
        disposition,
        agentName,
        agentId,
        amdStatus,
        queue
    };

    log(getTime(), "sent webhook data", JSON.stringify(apiBody));

    axios.post(apiUrl, apiBody)
        .then(response => log(getTime(), "got webhook response", JSON.stringify(response.data)))
        .catch(error => log(getTime(), "error in sending webhook data", error));

}