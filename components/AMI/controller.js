const controller = {};
const services = require('./services');
const Joi = require("joi");


// logoutAgent

controller.callBarge = async (payload) => {


    try {
        const schema = Joi.object().keys({
            number: Joi.number().required(),
            context: Joi.string().required(),
            mask: Joi.string().required(),
            exten: Joi.string().required(),
            channel: Joi.string().required()
        });

        const notValid = schema.validate(payload).error;

        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }


        const response = await services.callOriginate(payload);



        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            error: error.message
        }
    }

}

controller.logoutAgent = async (payload) => {


    try {
        const schema = Joi.object().keys({
            interface: Joi.string().required(),
            queue: Joi.string().required(),


        });

        const notValid = schema.validate(payload).error;

        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }


        const response = await services.logoutAgent(payload);



        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            error: error.message
        }
    }

}

controller.callOriginate = async (payload) => {

    try {
        console.log("call originate")
        const schema = Joi.object().keys({

            trunk: Joi.string().allow(null).required(),
            number: Joi.number().required(),
            context: Joi.string().required(),
            mask: Joi.string().required(),
            exten: Joi.number().required(),
        });

        const notValid = schema.validate(payload).error;

        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }


        const response = await services.callOriginate(payload);
        // response.catch(e => console.log(e))


        await response;


        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            error: error.message
        }
    }


}

controller.pauseQueue = async (payload) => {

    try {


        const schema = Joi.object().keys({
            queues: Joi.array().required(),
        });

        const notValid = schema.validate(payload).error;

        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }


        const response = await services.pauseQueue(payload);



        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            error: error.message
        }
    }
}

controller.unPauseQueue = async (payload) => {
    try {

        const schema = Joi.object().keys({
            queues: Joi.array().required(),
        });

        const notValid = schema.validate(payload).error;

        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }


        const response = await services.unPauseQueue(payload);



        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            error: error.message
        }
    }
}

controller.pauseSingle = async (payload) => {

    try {


        const schema = Joi.object().keys({
            queue: Joi.string().required(),
            interface: Joi.string().required(),
            reason: Joi.string().required(),
        });

        const notValid = schema.validate(payload).error;

        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }


        const response = await services.pauseSingle(payload);



        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            error: error.message
        }
    }
}

controller.unPauseSingle = async (payload) => {
    try {

        const schema = Joi.object().keys({
            queue: Joi.string().required(),
            interface: Joi.string().required(),
        });

        const notValid = schema.validate(payload).error;

        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }

        const response = await services.unPauseSingle(payload);

        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            error: error.message
        }
    }
}

controller.getMembers = async () => {

    try {

        const response = await services.getMembers();
        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            error: error.message
        }
    }
}

controller.getQueueStatus = async () => {

    try {
        const response = await services.getQueueStatus();
        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            error: error.message
        }
    }


}

controller.getQueueByName = async (payload) => {

    try {
        const schema = Joi.object().keys({
            name: Joi.string().required(),
        });

        const notValid = schema.validate(payload).error;

        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }

        const response = await services.getQueueByName(payload);
        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            error: error.message
        }
    }


}

controller.getCoreShowChannelsByName = async (payload) => {

    try {
        const schema = Joi.object().keys({
            name: Joi.string().required(),
        });

        const notValid = schema.validate(payload).error;

        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }

        const response = await services.getCoreShowChannelsByName(payload);
        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            error: error.message
        }
    }


}

controller.getSummaryName = async (payload) => {

    try {
        const schema = Joi.object().keys({
            name: Joi.string().required(),
        });

        const notValid = schema.validate(payload).error;

        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }

        const response = await services.getSummaryName(payload);
        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            error: error.message
        }
    }


}

controller.getQueueSummary = async () => {

    try {
        const response = await services.getQueueSummary();
        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            error: error.message
        }
    }

}

controller.getCoreShowChannels = async () => {

    try {
        const response = await services.getCoreShowChannels();
        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }

    } catch (error) {
        console.log("error  :", error);
    }


}

controller.sipShowPeers = async () => {
    try {


        const response = await services.sipShowPeers();
        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            error: error.message
        }
    }
}

controller.getCdrEvents = async () => {
    try {
        const response = await services.getCdrEvents();
        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            error: error.message
        }
    }
}

controller.getCelEvents = async () => {
    try {
        const response = await services.getCelEvents();
        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            error: error.message
        }
    }
}

controller.bridge = async (payload) => {

    try {


        const response = await services.bridge(payload);


        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            error: error.message
        }
    }



}

controller.redirect = async (payload) => {
    try {


        const response = await services.redirect(payload);


        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                data: [],
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            error: error.message
        }
    }

}


module.exports = controller;