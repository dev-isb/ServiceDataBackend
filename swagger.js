const swaggerAutogen = require("swagger-autogen")({ openapi: '3.0.0' });

const doc = {
    info: {
        version: "1.0.0",
        title: "AGENT STATS",
        description:
            "AGENT STATS STATUSES AND CHANNEL DATA",
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        {
            name: "User",
            description: "Endpoints",
        },
        {
            name: "AMI",
            description: "AMI apis to get current active stats",
        },
    ],
    securityDefinitions: {
        apiKeyAuth: {
            type: "apiKey",
            in: "header", // can be "header", "query" or "cookie"
            name: "Authorization", // name of the header, query parameter or cookie
            description: "any description...",
        },
    },
    definitions: {
        Parents: {
            father: "Simon Doe",
            mother: "Marie Doe",
        },
        User: {
            name: "Jhon Doe",
            age: 29,
            parents: {
                $ref: "#/definitions/Parents",
            },
            diplomas: [
                {
                    school: "XYZ University",
                    year: 2020,
                    completed: true,
                    internship: {
                        hours: 290,
                        location: "XYZ Company",
                    },
                },
            ],
        },
        CreateUser: {
            email: "test@test.com",
            password: "123321"
        },
        CreateJob:

        {
            "name": "test",
            "type": "predictive",
            "pause": 0,
            "complete": 0,
            "startTime": "2022-08-10 20:00:00",
            "endTime": "2022-08-10 23:00:00",
            "jobData": [
                {
                    "number": "231203",
                    "mask": "123456",
                    "context": "default",
                    "trunk": "outgoing"

                }
            ]

        }
        ,
        UpdateJob: {
            "name": "test",
            "type": "predictive",
            "pause": 0,
            "complete": 0,
            "startTime": "2022-08-10 20:00:00",
            "endTime": "2022-08-10 23:00:00",
            "jobData": [
                {
                    "number": "231203",
                    "mask": "123456",
                    "context": "default",
                    "trunk": "outgoing"

                }
            ]
        },
        Summary: {
            "response": {
                "success": true,
                "data": [

                    {
                        "event": "QueueSummary",
                        "queue": "sales",
                        "loggedin": "0",
                        "available": "0",
                        "callers": "0",
                        "holdtime": "0",
                        "talktime": "0",
                        "longestholdtime": "0",
                        "actionid": "1660287273579"
                    }
                ]
            }
        },
        Status: {
            "response": {
                "success": true,
                "data": [
                    {
                        "event": "QueueMember",
                        "queue": "sales",
                        "name": "SIP/salman",
                        "location": "SIP/salman",
                        "stateinterface": "SIP/salman",
                        "membership": "dynamic",
                        "penalty": "0",
                        "callstaken": "0",
                        "lastcall": "0",
                        "lastpause": "0",
                        "incall": "0",
                        "status": "5",
                        "paused": "0",
                        "pausedreason": "",
                        "wrapuptime": "0",
                        "actionid": "1660286739498"
                    }
                ]
            }
        },
        SipPeers: {
            "response": {
                "success": true,
                "data": [
                    {
                        "event": "PeerEntry",
                        "actionid": "1660286907216",
                        "channeltype": "SIP",
                        "objectname": "salman",
                        "chanobjecttype": "peer",
                        "ipaddress": "-none-",
                        "ipport": "0",
                        "dynamic": "yes",
                        "autoforcerport": "no",
                        "forcerport": "no",
                        "autocomedia": "no",
                        "comedia": "no",
                        "videosupport": "no",
                        "textsupport": "no",
                        "acl": "no",
                        "status": "UNKNOWN",
                        "realtimedevice": "no",
                        "description": "",
                        "accountcode": ""
                    }
                ]
            }
        },
        Pause: {
            "queues": [{ queue: 'tenent1', reason: "some reason" }, { queue: 'tenent1', reason: "some reason" }]
        },
        UnPause: {
            "queues": ['tenent1', 'tenent2']
        },
        PauseMemeber: {

            "queue": "tenent1",
            "interface": "PJSIP/3000",
            "reason": "some reason"
        },
        UnPauseMemeber: {

            "queue": "tenent1",
            "interface": "PJSIP/3000"

        },
        Originate: {

            "trunk": "name of trunk"
            , "number": "777968656"
            , "context": "dafault"
            , "mask": "9898989"
            , "exten": "88856472"

        },
        AgentLogOut: {
            "interface": "pjsip/1001"
        },

        Spy: {

            // "trunk": "name of trunk"
            "channel": "only channel prfix like 6002 for PJSIP/6002-00000001 "
            , "number": "777968656"
            , "context": "dafault"
            , "mask": "9898989"
            , "exten": "88856472"

        },
        Redirect: {

            // "trunk": "name of trunk"
            "channel": "only channel prfix like 6002 for PJSIP/6002-00000001 ",
            "exten": "6666",
            "context": "test",
            "priority": 's',
            "extraChannel": "channel extra"

        },
        Bridge: {

            // "trunk": "name of trunk"
            "channel1": "sample channel 1",
            "channel2": "sample channel 2",
            "tone": ""

        },
        Barge: {
            "channel": "only channel prfix like 6002 for PJSIP/6002-00000001 "
            , "number": "777968656"
            , "context": "dafault"
            , "mask": "9898989"
            , "exten": "88856472"

        },
        Channel: {
            "response": {
                "success": true,
                "data": [
                    {
                        "event": "CoreShowChannel",
                        "actionid": "1660287123427",
                        "channel": "SIP/server-00006a17",
                        "channelstate": "6",
                        "channelstatedesc": "Up",
                        "calleridnum": "3478349033",
                        "calleridname": "<unknown>",
                        "connectedlinenum": "<unknown>",
                        "connectedlinename": "<unknown>",
                        "language": "en",
                        "accountcode": "",
                        "context": "OFFER_SERVICE",
                        "exten": "s",
                        "priority": "9",
                        "uniqueid": "1660287120.27621",
                        "linkedid": "1660287120.27621",
                        "application": "BackGround",
                        "applicationdata": "/home/AUDIO/non_subscribers",
                        "duration": "00:00:03",
                        "bridgeid": ""
                    }
                ]
            }
        },
        AddUser: {
            $email: "BEN@gmail.com",
            $password: "XYZ"
        },
        Authorized: {
            "message": "Successfully found"
        },
        PatchJob: {
            "name": "test",
            "type": "predictive",
            "pause": 0,
            "complete": 0,
            "startTime": "2022-08-10 20:00:00",
            "endTime": "2022-08-10 23:00:00"
        },
        Inject: {
            "number": "3466880042",
            "mask": "4698818251",
            "context": "from-trunk",
            "trunk": "Out-Inov",
            "exten": "14698818251",
            "jobId": "1",
            "first": 1,
            "callbackUrl": "http://localhost:3000/logger"
        }
    },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require("./app"); // Your project's root file
});
