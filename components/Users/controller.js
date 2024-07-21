
const controller = {};
const Joi = require("joi");
const services = require('./services');
controller.get = async () => {
    try {
        const response = await services.get();
        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("errror  : ", error);
        return {
            success: false,
            error: error.message
        }
    }
}
controller.getById = async (payload) => {
    try {
        const schema = Joi.object().keys({
            id: Joi.number().required()
        });
        const notValid = schema.validate(payload).error;
        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }
        const response = await services.getById(payload);
        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        else {
            return {
                success: false,
                message: "no record found"
            }
        }
    } catch (error) {
        console.log("errror  : ", error);
        return {
            success: false,
            error: error.message
        }
    }
}
controller.create = async (payload) => {
    try {
        const response = await services.create(payload);
        return {
            success: true,
            data: response
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            error: error.message
        }
    }
}

controller.dashboardStats = async () => {
    try {
        const response = await services.dashboardStats();
        return {
            success: true,
            data: response
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            data: null
        }
    }
}

controller.update = async (payload) => {
    try {
        const response = await services.update(payload);
        return {
            success: true,
            data: response
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            error: error.message
        }
    }
}
controller.delete = async (payload) => {
    try {
        const schema = Joi.object().keys({
            id: Joi.number().required(),
        });
        const notValid = schema.validate(payload).error;
        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }
        const response = await services.delete(payload);
        return {
            success: true,
            data: response
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            error: error.message
        }
    }
}
controller.getRefreshToken = async (payload) => {
    const schema = Joi.object().keys({
        refreshToken: Joi.string().required()
    });
    const notValid = schema.validate(payload).error;
    if (notValid) {
        return {
            success: false,
            message: notValid.message,
        };
    }
    const response = await services.getRefreshToken(payload);
    if (response) {
        return {
            success: true,
            data: response
        }
    }
    else {
        return {
            success: false,
            message: "unable to refresh token"
        }
    }
}
controller.signin = async (payload) => {
    try {
        const schema = Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required()
        });
        const notValid = schema.validate(payload).error;
        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }
        const data = await services.signIn(payload);
        if (data) {
            return {
                success: true,
                data,
            }
        }
        else {
            return {
                success: false,
                message: "User not subscribed"
            }
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: "error" + error.message
        }
    }
}
controller.signInApp = async (payload) => {
    try {
        const schema = Joi.object().keys({
            username: Joi.string().required(),
            msisdn: Joi.string().required()
        });
        const notValid = schema.validate(payload).error;
        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }
        const data = await services.signInApp(payload);
        if (data) {
            return {
                success: true,
                data,
            }
        }
        else {
            return {
                success: false,
                message: "User not subscribed"
            }
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: "error" + error.message
        }
    }
}
module.exports = controller;
