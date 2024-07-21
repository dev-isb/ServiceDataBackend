const controller = {};
const Joi = require("joi");
const services = require('./services');
var parser = require('simple-excel-to-json');
const path = require('path');
controller.getJobs = async (payload) => {
    try {
        const schema = Joi.object().keys({
            limit: Joi.string().required(),
            offset: Joi.string().required(),
            jobId: Joi.string().optional().allow(null)
        });
        const foundError = schema.validate(payload).error;
        if (foundError) {
            return {
                success: false,
                message: `Invalid payload: ${foundError.message}`
            };
        }
        const response = await services.getJobs(payload);
        if (response.jobs.length > 0) {
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
controller.createJobCsv = async (payload) => {
    try {
        console.log("payload in controller : ", payload);
        const { data } = payload;
        const schema = Joi.object().keys({
            fileName: Joi.string().required()
        }).unknown();
        const notValid = schema.validate(payload).error;
        if (notValid) {
            return {
                success: false,
                message: notValid
            }
        }
        var numberData = parser.parseXls2Json(path.resolve(`./jobData/${payload.fileName}`));
        console.log(`../../bulkAdvisoryJobs/${payload.fileName}`);
        delete payload.fileName;
        const numberDataValue = [];
        for (const iterator of numberData[0]) {
            if (String(iterator?.number).trim()) {
                numberDataValue.push(iterator);
            }
        }
        data.jobData = numberDataValue;
        const response = await services.createJob(data);
        return {
            success: true,
            message: "Job created successfully",
            data: response
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            message: "Error in creating Job"
        }
    }
}
controller.getJobById = async (payload) => {
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
        const response = await services.getJobById(payload);
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
controller.createJob = async (payload) => {
    try {
        const schema = Joi.object().keys({
            name: Joi.string().required(),
            type: Joi.string().required(),
            pause: Joi.number().required(),
            complete: Joi.number().required(),
            jobData: Joi.array().required().allow(null),
            startTime: Joi.string().required(),
            endTime: Joi.string().required(),
            frequency: Joi.number().optional(),
            queue: Joi.string().optional(),
            active: Joi.number().optional(),
            concurrency: Joi.number().optional(),
            // type
        });
        const notValid = schema.validate(payload).error;
        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }
        const response = await services.createJob(payload);
        return {
            success: true,
            message: "Job created successfully",
            data: response
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            message: "Error in creating Job"
        }
    }
}
controller.updateJob = async (payload) => {
    try {
        const schema = Joi.object().keys({
            name: Joi.string().optional(),
            id: Joi.number().required(),
            type: Joi.string().optional(),
            pause: Joi.number().optional(),
            complete: Joi.number().optional(),
            startTime: Joi.string().optional().allow(null),
            frequency: Joi.number().optional().allow(null),
            endTime: Joi.string().optional().allow(null),
            jobData: Joi.array().optional()
        }).unknown();
        const notValid = schema.validate(payload.data).error;
        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }
        const schema2 = Joi.object().keys({
            fileName: Joi.string().required()
        }).unknown();
        const notValid2 = schema.validate(payload.fileName).error;
        if (notValid) {
            return {
                success: false,
                message: notValid2
            }
        }
        var numberData = parser.parseXls2Json(path.resolve(`./jobData/${payload.fileName}`));
        console.log(`../../bulkAdvisoryJobs/${payload.fileName}`);
        delete payload.fileName;
        const numberDataValue = [];
        for (const iterator of numberData[0]) {
            if (String(iterator?.number).trim()) {
                numberDataValue.push(iterator);
            }
        }
        payload.data.jobData = numberDataValue;
        console.log("jobData", JSON.stringify(payload.data));
        const response = await services.updateJob(payload.data);
        return {
            success: true,
            message: "Job updated successfully",
            data: response
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            message: "Error in updating Job"
        }
    }
}
controller.updateJobFields = async (payload) => {
    try {
        const schema = Joi.object().keys({
            name: Joi.string().optional().allow(null),
            id: Joi.number().required(),
            type: Joi.string().optional().allow(null),
            pause: Joi.number().optional(),
            complete: Joi.number().optional().allow(null),
            startTime: Joi.string().optional().allow(null),
            active: Joi.string().optional().allow(null),
            endTime: Joi.string().optional().allow(null),
            frequency: Joi.number().optional().allow(null),
            concurrency: Joi.number().optional().allow(null)
        }).unknown();
        const notValid = schema.validate(payload).error;
        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }
        const response = await services.updateJobFields(payload);
        return {
            success: true,
            message: "Job updated successfully",
            data: response
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            message: "Error in updating Job"
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
        if (response > 0) {
            return {
                success: true,
                message: "Job deleted successfully",
                data: response
            }
        } else {
            return {
                success: false,
                message: "Error in deleting Job"
            }
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            message: "Error in deleting Job"
        }
    }
}
controller.deleteJobCdrById = async (payload) => {
    try {
        const schema = Joi.object().keys({
            id: Joi.string().required(),
        });
        const notValid = schema.validate(payload).error;
        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }
        const response = await services.deleteJobCdrById(payload);
        return {
            success: true,
            message: "Record deleted successfully",
            data: response
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            message: "Error in deleting record"
        }
    }
}
controller.deleteJobCdrByJobId = async (payload) => {
    try {
        const schema = Joi.object().keys({
            jobId: Joi.string().required(),
        });
        const notValid = schema.validate(payload).error;
        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }
        const response = await services.deleteJobCdrByJobId(payload);
        if (response > 0) {
            return {
                success: true,
                message: "Records deleted successfully",
                data: response
            }
        } else {
            return {
                success: false,
                message: "Error in deleting records"
            }
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            message: "Error in deleting records"
        }
    }
}
controller.jobTypes = async () => {
    try {
        const response = await services.jobTypes()
        if (response.length > 0) {
            return {
                success: true,
                data: response
            }
        }
        return {
            success: false,
            message: "no record found "
        }
    } catch (error) {
        console.log("error :", error);
        return {
            success: false,
            error: error.message
        }
    }
}
controller.jobCdrs = async (payload) => {
    try {
        const schema = Joi.object().keys({
            limit: Joi.string().required(),
            offset: Joi.string().required(),
            jobId: Joi.string().optional().allow(null)
        });
        const foundError = schema.validate(payload).error;
        if (foundError) {
            return {
                success: false,
                message: `Invalid payload: ${foundError.message}`
            };
        }
        const response = await services.jobCdrs(payload);
        return {
            success: true,
            data: response
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            message: "error in getting job cdr records"
        }
    }
}
controller.injectLead = async (payload) => {
    try {
        const schema = Joi.object().keys({
            jobId: Joi.string().required(),
            number: Joi.string().required(),
            mask: Joi.string().required(),
            trunk: Joi.string().required(),
            exten: Joi.string().required(),
            context: Joi.string().required()
        }).unknown();
        const notValid = schema.validate(payload).error;
        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }
        const response = await services.injectLead(payload);
        if (response && Object.keys(response).length) {
            return {
                success: true,
                message: "Records injected successfully",
                data: response
            }
        } else {
            return {
                success: false,
                message: "Error in injecting records"
            }
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            message: "Error in injecting records"
        }
    }
}
controller.jobStat = async (payload) => {
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
        const response = await services.jobStat(payload);
        if (response) {
            return {
                success: true,
                data: response
            }
        } else {
            return {
                success: false,
                message: "Error in getting stats"
            }
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            message: "Error in getting stats"
        }
    }
}
controller.deletePhoneCall = async (payload) => {
    try {
        const schema = Joi.object().keys({
            id: Joi.number().required(),
            jobId: Joi.number().required()
        });
        const notValid = schema.validate(payload).error;
        if (notValid) {
            return {
                success: false,
                message: notValid.message,
            };
        }
        const response = await services.deletePhoneCall(payload);
        if (response > 0) {
            return {
                success: true,
                message: "Job deleted successfully",
                data: response
            }
        } else {
            return {
                success: false,
                message: "unable to delete phone call"
            }
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            message: "Error in deleting Job"
        }
    }
}
// delInActJob
controller.delInActJob = async (payload) => {
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
        const response = await services.delInActJob(payload);
        if (response > 0) {
            return {
                success: true,
                message: "Job deleted successfully",
                data: response
            }
        } else {
            return {
                success: false,
                message: "Error in deleting Job"
            }
        }
    } catch (error) {
        console.log("error : ", error);
        return {
            success: false,
            message: "Error in deleting Job"
        }
    }
}
module.exports = controller;