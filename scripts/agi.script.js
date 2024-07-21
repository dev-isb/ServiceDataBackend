require('dotenv').config()
const axios = require("axios");
const agiServer = require('ding-dong');
const moment = require("moment");
const getTime = () => moment().format('YYYY-MM-DD HH:mm:ss');
const log = console.log;
const { WEBHOOK_URL, AGI_PORT } = process.env;
log(getTime(), { WEBHOOK_URL, AGI_PORT });



const agiMapper = {
    "sendWebhookData": async function ({ channel }) {
        const { success, data } = await getChannelDetails({ channel });

        if (!success) return;

        const amdStatus = await getChannelVariableValue({ channel, key: "AMDSTATUS" });
        data.amdStatus = amdStatus || "NONE";
        data.disposition = "AMD";
        sendWebhookApiData({ ...data });
    }
};



const getChannelVariableValue = async (payload) => {
    const { channel, key } = payload;
    //{ code: 200, result: '1', value: 'sendWebhookData' }
    const { code, result, value } = await channel.getVariable(key);
    log(getTime(), "got channel key", key, "value", JSON.stringify({ code, result, value }));
    if (result == "1") {
        return value
    }
    return null;
}

const getChannelDetails = async (payload) => {
    const { channel } = payload;
    const jobId = await getChannelVariableValue({ channel, key: "jobId" });

    if (!jobId) {
        return {
            success: false,
            data: {}
        };
    }

    // const slpId = await getChannelVariableValue({ channel, key: "slpId" });
    const trunk = await getChannelVariableValue({ channel, key: "trunk" });
    const callbackUrl = await getChannelVariableValue({ channel, key: "callbackUrl" });
    const toNumber = await getChannelVariableValue({ channel, key: "toNumber" });
    const fromNumber = await getChannelVariableValue({ channel, key: "fromNumber" });
    const queue = await getChannelVariableValue({ channel, key: "queue" });

    return {
        success: true,
        data: {
            // slpId,
            jobId,
            trunk,
            callbackUrl,
            toNumber,
            fromNumber,
            queue
        }
    };
}

const sendWebhookApiData = async (payload) => {
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

const requestMessage = async function (channel) {
    const action = await getChannelVariableValue({ channel, key: "actions" });
    log(getTime(), "calling action : ", action);

    const agi = agiMapper[action];

    if (agi) {
        await agi({ channel });
    } else {
        log(getTime(), "Error : Agi not found : ", action);
    }
    channel.end();
};


const app = new agiServer(requestMessage, { debug: false });
log(getTime(), "agi server start listening on : ", AGI_PORT);
app.start(AGI_PORT);









