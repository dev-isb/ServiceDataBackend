const services = {};
const config = require('../../config/amiConfig');
const apiConfig = require('../../config/apiConfig');
const { port, host, username, password } = config;

const axios = require('axios');
const cdrResponse = [];
const celResponse = [];
var ami = new require('asterisk-manager')(port, host, username, password, true);
// In case of any connectiviy problems we got you coverd.
ami.keepConnected();
ami.on('response', function (evt) {
});
ami.on('cdr', function (evt) {
    if (apiConfig.enabledCdr) {
        axios.post(`${apiConfig.urlCdr}`, { data: evt }).catch(err => console.log(JSON.stringify(err)));
    }
    cdrResponse.push(evt);
}
)
ami.on('cel', function (evt) {


    if (apiConfig.enabledCel) {
        axios.post(`${apiConfig.urlCel}`, { data: evt }).catch(err => console.log(JSON.stringify(err)));
    }

    celResponse.push(evt);

}
)
// Listen for any/all AMI events.
// ami.on('managerevent', function (evt) { });

// Listen for specific AMI events. A list of event names can be found at
// https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Events
// ami.on('hangup', function (evt) { });
// ami.on('confbridgejoin', function (evt) { });

// Listen for Action responses.
// ami.on('response', function (evt) { });

// Perform an AMI Action. A list of actions can be found at
// https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Actions




// getSummaryName

services.getCoreShowChannelsByName = async (payload) => {
    const { name } = payload;
    const queuesByName = await services.getQueueByName({ name });
    const coreChannels = await services.getCoreShowChannels();
    const returiningObject = [];
    for (const { name, event } of queuesByName) {

        if (event == 'QueueMember') {

            for (const coreChannel of coreChannels) {

                const { channel } = coreChannel;
                if (channel.toLowerCase().includes(name.toLowerCase())) {
                    returiningObject.push(coreChannel)
                }
            }
        }
    }
    return returiningObject

}

services.getSummaryName = async (payload) => {
    const { name } = payload;

    const responseArray = [];
    const queues = await services.getQueueSummary();

    if (queues && queues.length > 0) {
        for (const queue of queues) {


            if (!(queue.event == 'QueueSummaryComplete')) {


                if ((queue?.queue.toLowerCase()).includes(name.toLowerCase())) {

                    responseArray.push(queue);

                }
            }


        }
    }

    return responseArray;
}

services.logoutAgent = async (payload) => {

    const { interface: agentInterface, queue } = payload;
    var listenerArray = [];

    return new Promise((resolve, reject) => {


        ami.action({
            'action': 'QueueRemove',
            'interface': agentInterface,
            'queue': queue

        }, function (err, res) {

            if (err) {
                reject(err);
            }
            // const { actionId } = res;

            console.log(res);
            if (res?.response == 'Success') {
                console.log("agen logged of", res);

                resolve("logged off" + interface);
            }
            else {
                console.log("agent logout failed :", res);
                resolve("Failed");

            }
        });
    })

}

services.getMembers = async () => {

    var listenerArray = [];

    return new Promise((resolve, reject) => {


        ami.action({
            'action': 'Agents',
        }, function (err, res) {

            if (err) {
                reject(err);
            }
            const { actionId } = res;

            const functionObject = {};

            functionObject[actionId] = function (evt) {
                // console.log(evt);
                if (evt?.actionId === actionId) {
                    listenerArray.push(evt)
                }
                if (evt && evt?.event === 'AgentsComplete' && evt?.actionId === actionId) {
                    ami.removeListener('managerevent', functionObject[actionId])
                    resolve(listenerArray)
                }

            }


            ami.on('managerevent', functionObject[actionId]);
        });
    })

}

services.getQueueByName = async (payload) => {
    const { name } = payload;

    const responseArray = [];
    const queues = await services.getQueueStatus();

    if (queues && queues.length > 0) {
        for (const queue of queues) {


            if (!(queue.event == 'QueueStatusComplete')) {


                if ((queue?.queue.toLowerCase()).includes(name.toLowerCase())) {

                    responseArray.push(queue);

                }
            }


        }
    }

    return responseArray;
}

services.getQueueStatus = async () => {
    var listenerArray = [];

    return new Promise((resolve, reject) => {

        ami.action({
            'action': 'QueueStatus',
        }, function (err, res) {

            if (err) {
                reject(err);
            }
            const { actionId } = res;

            const functionObject = {};
            functionObject[actionId] = function (evt) {
                if (evt?.actionId === actionId) {
                    listenerArray.push(evt)
                }
                if (evt && evt?.event === 'QueueStatusComplete' && evt?.actionId === actionId) {
                    ami.removeListener('managerevent', functionObject[actionId])
                    resolve(listenerArray)
                }

            }

            ami.on('managerevent', functionObject[actionId]);
        });
        // QueueStatus
    })
}

services.getQueueSummary = async () => {
    var listenerArray = [];

    return new Promise((resolve, reject) => {

        ami.action({
            'action': 'QueueSummary',
        }, function (err, res) {


            if (err) {
                reject(err);
            }
            const { actionId } = res;
            const functionObject = {};
            functionObject[actionId] = function (evt) {
                if (evt?.actionId === actionId) {
                    listenerArray.push(evt)
                }
                if (evt && evt?.event === 'QueueSummaryComplete' && evt?.actionId === actionId) {
                    ami.removeListener('managerevent', functionObject[actionId])
                    resolve(listenerArray)
                }

            }


            ami.on('managerevent', functionObject[actionId]);
        });
        // QueueStatus
    })
}

services.getCoreShowChannels = async () => {


    console.log("core show channels ")
    var listenerArray = [];
    return new Promise((resolve, reject) => {

        ami.action({
            'action': 'CoreShowChannels',
        }, function (err, res) {

            // resolve(res);
            const { actionId } = res;

            const functionObject = {};
            functionObject[actionId] = function (evt) {
                if (evt && evt?.event === 'CoreShowChannel' && evt?.actionId === actionId) {
                    listenerArray.push(evt)
                }
                if (evt && evt?.event === 'CoreShowChannelsComplete' && evt?.actionId === actionId) {
                    ami.removeListener('managerevent', functionObject[actionId]);
                    resolve(listenerArray)
                }

            }


            ami.on('managerevent', functionObject[actionId]);

        });
        // QueueStatus
    })
}

services.sipShowPeers = async () => {
    // SIPshowpeer


    var listenerArray = [];

    return new Promise((resolve, reject) => {



        ami.action({
            'action': 'PJSIPShowEndpoints',
        }, function (err, res) {


            // console.log("res :", res);
            const { actionId } = res;


            const functionObject = {};
            functionObject[actionId] = (evt) => {
                if (evt?.actionId === actionId) {
                    listenerArray.push(evt)
                }
                if (evt && evt?.event === 'EndpointListComplete' && evt?.actionId === actionId) {
                    // ami.removeListener('managerevent')

                    ami.removeListener('managerevent', functionObject[actionId])
                    resolve(listenerArray)
                }
            }



            ami.on('managerevent', functionObject[actionId]);

        });
    })
}

services.getCdrEvents = async () => {

    return cdrResponse;
}

services.getCelEvents = async () => {
    return celResponse;
}

services.pauseQueue = async (payload) => {

    const { queues } = payload;
    for (const { queue, reason = "" } of queues) {

        const fetchRecordAllMemebers = await services.getQueueByName({ name: queue });

        for (const member of fetchRecordAllMemebers) {
            if (member.event === "QueueMember") {



                ami.action({
                    'action': 'QueuePause',
                    'interface': member.stateinterface,
                    'paused': true,
                    'queue': queue,
                    'reason': reason
                }, function (err, res) {


                    // console.log("res :", res);
                    const { actionId } = res;


                    const functionObject = {};
                    functionObject[actionId] = (evt) => {

                        if (evt?.actionId === actionId) {
                            // ami.removeListener('managerevent')
                            ami.removeListener('managerevent', functionObject[actionId])
                            // resolve(listenerArray)
                        }
                    }



                    ami.on('managerevent', functionObject[actionId]);

                });



            }

        }


    }

    return queues

}

services.unPauseQueue = async (payload) => {

    const { queues } = payload;
    for (const queue of queues) {

        const fetchRecordAllMemebers = await services.getQueueByName({ name: queue });

        for (const member of fetchRecordAllMemebers) {
            if (member.event === "QueueMember") {

                ami.action({
                    'action': 'QueuePause',
                    'interface': member.stateinterface,
                    'paused': false,
                    'queue': queue
                }, function (err, res) {


                    // console.log("res :", res);
                    const { actionId } = res;


                    const functionObject = {};
                    functionObject[actionId] = (evt) => {

                        if (evt?.actionId === actionId) {
                            // ami.removeListener('managerevent')
                            ami.removeListener('managerevent', functionObject[actionId])
                            // resolve(listenerArray)
                        }
                    }



                    ami.on('managerevent', functionObject[actionId]);

                });



            }

        }


    }

    return queues

}

services.pauseSingle = async (payload) => {

    const { queue, interface, reason } = payload;
    return new Promise((resolve, reject) => {


        ami.action({
            'action': 'QueuePause',
            'interface': interface,
            'paused': true,
            'queue': queue,
            'reason': reason
        }, function (err, res) {


            // console.log("res :", res);
            const { actionId } = res;


            const functionObject = {};
            functionObject[actionId] = (evt) => {
                if (evt?.actionId === actionId) {
                    // ami.removeListener('managerevent')
                    ami.removeListener('managerevent', functionObject[actionId])
                    resolve(`${interface} paused`)
                }
            }



            ami.on('managerevent', functionObject[actionId]);

        });



        // }

    })


}

services.callOriginate = async (payload) => {

    const { trunk = null, number, context, mask, exten, channel = null } = payload;
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            console.log(JSON.stringify({
                action: 'originate',
                channel: trunk ? `pjsip/${trunk}/${number}` : `pjsip/${number}`,
                context: context,
                callerId: mask,
                exten: channel ? `${exten}_${channel}` : exten,
                priority: 1,
                async: true
            }));

            ami.action({
                action: 'originate',
                channel: trunk ? `pjsip/${trunk}/${number}` : `pjsip/${number}`,
                context: context,
                callerId: mask,
                exten: channel ? `${exten}_${channel}` : exten,
                priority: 1,
                async: true
            }, function (err, res) {


                if (err) {
                    console.log("errror :", err)
                }

                if (res?.response == 'Success') {
                    console.log("call originated successfully", res);

                    resolve("originated");
                }
                else {
                    console.log("call failed :", res);
                    resolve("Failed");

                }

            });
        }, 1000);

    })
}


services.unPauseSingle = async (payload) => {

    const { queue, interface } = payload;
    return new Promise((resolve, reject) => {





        ami.action({
            'action': 'QueuePause',
            'interface': interface,
            'paused': false,
            'queue': queue
        }, function (err, res) {


            // console.log("res :", res);
            const { actionId } = res;


            const functionObject = {};
            functionObject[actionId] = (evt) => {

                if (evt?.actionId === actionId) {
                    // ami.removeListener('managerevent')
                    ami.removeListener('managerevent', functionObject[actionId])
                    resolve(`${interface} unpaused`)
                }
            }



            ami.on('managerevent', functionObject[actionId]);

        });


    })


}

/* 

/ami/bridge
{
    channel1:"sample channel 1",
    channel2:"sample channel 2",
    tone:""
}
*/
services.bridge = async (payload) => {

    const { channel1, channel2, tone } = payload;

    const actionObject = {

        action: 'Bridge',
    }

    if (channel1) {
        actionObject["channel1"] = channel1;
    }
    if (channel2) {
        actionObject["channel2"] = channel2;

    }
    if (tone) {
        actionObject["tone"] = tone;


    }

    return new Promise((resolve, reject) => {


        ami.action(actionObject, function (err, res) {
            if (err) {
                reject(err);
            }

            console.log(res);
            if (res?.response == 'Success') {
                console.log("channel bridged", res);

                resolve("channel bridged");
            }
            else {
                console.log("agent logout failed : ", res);
                resolve("Failed");

            }
        });
    })

}

/* 
/ami/redirect
{
    channel:""
    exten :"6666",
    context:"test",
    priority:'s'
}



*/

services.redirect = async (payload) => {
    const { exten, context, priority, channel, extraChannel } = payload;

    const actionObject = {

        action: 'Redirect',
        channel: channel
    }

    if (exten) {
        actionObject["exten"] = exten;
    }
    if (context) {
        actionObject["context"] = context;

    }
    if (priority) {
        actionObject["priority"] = priority;

    }

    if (extraChannel) {
        actionObject["extrachannel"] = extraChannel;

    }

    return new Promise((resolve, reject) => {


        /* 
        Action: Redirect
ActionID: <value>
Channel: <value>
ExtraChannel: <value>
Exten: <value>
ExtraExten: <value>
Context: <value>
ExtraContext: <value>
Priority: <value>
ExtraPriority: <value>
        */

        ami.action(actionObject, function (err, res) {

            if (err) {
                reject(err);
            }
            // const { actionId } = res;

            console.log(res);
            if (res?.response == 'Success') {
                console.log("call redirected", res);

                resolve("logged call redirected");
            }
            else {
                console.log("call redirect failed :", res);
                resolve("Failed");

            }
        });
    })
}


module.exports = services;