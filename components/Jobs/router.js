const express = require("express");
const router = express.Router();
const controller = require("./controller");
// const { isAuthorized } = require("../../middlewares/auth");
const multer = require('multer');
const path = require('path');
console.log("path.resolve('./jobData') : ", path.resolve('./jobData'));
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./jobData'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
var upload = multer({
    storage: storage
});
var uploadMulter = upload.single('file');
router.post("/upload-data", uploadMulter, async (req, res) => {
    /* 	#swagger.tags = ['Jobs']
            #swagger.description = 'get jobs today' */
    /*  #swagger.requestBody = {
    required: true,
    "@content": {
        "multipart/form-data": {
            schema: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    type: {
                        type: "string"
                    },
                    pause: {
                        type: "number"
                    },
                    complete: {
                        type: "number"
                    },
                    startTime: {
                        type: "string"
                    },
                    endTime: {
                        type: "string"
                    },
                    active: {
                        type: "number"
                    },
                    queue: {
                        type: "string"
                    },
                    concurrency: {
                        type: "number"
                    },
                    file: {
                                type: "string",
                                format: "binary"
                    }
                },
            }
        }
    } 
} */
    console.log("body is : ", req.body);
    const payload = { fileName: req.file.filename, data: req.body }
    const response = await controller.createJobCsv(payload);
    res.status(201).json(response);
})
router.post("/", async (req, res) => {
    // #swagger.tags = ['Job']
    // #swagger.description = 'create new out dial jobs.'
    /*	#swagger.parameters['obj'] = {
               in: 'body',
               description: 'User information.',
               required: true,
               schema: { $ref: "#/definitions/CreateJob" }
       } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    const payload = req.body;
    const response = await controller.createJob(payload)
    res.status(200).json({
        response
    })
});
router.put("/:id", uploadMulter, async (req, res) => {
    // #swagger.tags = ['Job']
    // #swagger.description = 'update outbound job by id.'
    /*  #swagger.requestBody = {
    required: true,
    "@content": {
        "multipart/form-data": {
            schema: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    type: {
                        type: "string"
                    },
                    pause: {
                        type: "number"
                    },
                    complete: {
                        type: "number"
                    },
                    startTime: {
                        type: "string"
                    },
                    endTime: {
                        type: "string"
                    },
                    active: {
                        type: "number"
                    },
                    queue: {
                        type: "string"
                    },
                    concurrency: {
                        type: "number"
                    },
                    frequency: {
                        type: "number"
                    },
                    file: {
                                type: "string",
                                format: "binary"
                    }
                },
            }
        }
    } 
} */
    console.log("body is : ", req.body);
    const payload = { fileName: req.file.filename, data: req.body };
    payload.data.id = req.params.id;
    const response = await controller.updateJob(payload)
    // console.log(response);
    res.status(201).json(response);
});
router.patch("/:id", async (req, res) => {
    // #swagger.tags = ['Job']
    // #swagger.description = 'update outbound job by id.'
    /*	#swagger.parameters['obj'] = {
               in: 'body',
               description: 'User information.',
               required: true,
               schema: { $ref: "#/definitions/PatchJob" }
       } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    const payload = { ...req.body, id: req.params.id };
    const response = await controller.updateJobFields(payload)
    // console.log(response);
    res.status(200).json(response);
});
router.delete("/:id", async (req, res) => {
    // #swagger.tags = ['Job']
    // #swagger.description = 'all sip peers.'
    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/SipPeers" },
        description: "all sip peers." } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    const payload = { id: req.params.id };
    const response = await controller.delete(payload)
    res.status(200).json(
        response
    )
});
router.get("/", async (req, res) => {
    // #swagger.tags = ['Job']
    // #swagger.description = 'all sip peers.'
    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/SipPeers" },
        description: "all sip peers." } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    // const payload = { id: req.params.id };
    console.log("req.params", req.query)
    const response = await controller.getJobs(req.query)
    res.status(200).json(response)
});
router.get("/types", async (req, res) => {
    // #swagger.tags = ['Job']
    // #swagger.description = 'all sip peers.'
    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/SipPeers" },
        description: "all sip peers." } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    // const payload = { id: req.params.id };
    const response = await controller.jobTypes()
    res.status(200).json(response);
});
router.get("/:id", async (req, res) => {
    // #swagger.tags = ['Job']
    // #swagger.description = 'all sip peers.'
    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/SipPeers" },
        description: "all sip peers." } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    // const payload = { id: req.params.id };
    const response = await controller.getJobById(req.params)
    res.status(200).json({
        response
    })
});
router.post("/cdrs", async (req, res) => {
    // #swagger.tags = ['Job']
    // #swagger.description = 'create new out dial jobs.'
    /*	#swagger.parameters['obj'] = {
               in: 'body',
               description: 'User information.',
               required: true,
               schema: { $ref: "#/definitions/CreateJob" }
       } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    const response = await controller.jobCdrs(req.body)
    res.status(200).json(response)
});
router.delete("/cdr-record/:id", async (req, res) => {
    // #swagger.tags = ['Job']
    // #swagger.description = 'all sip peers.'
    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/SipPeers" },
        description: "all sip peers." } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    const payload = { id: req.params.id };
    const response = await controller.deleteJobCdrById(payload)
    res.status(200).json(
        response
    )
});
router.delete("/job-cdrs/:jobId", async (req, res) => {
    // #swagger.tags = ['Job']
    // #swagger.description = 'all sip peers.'
    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/SipPeers" },
        description: "all sip peers." } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    const payload = { jobId: req.params.jobId };
    const response = await controller.deleteJobCdrByJobId(payload)
    res.status(200).json(
        response
    )
});
router.post("/inject", async (req, res) => {
    // #swagger.tags = ['Job']
    // #swagger.description = 'all sip peers.'
    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/Inject" },
        description: "all sip peers." } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    const payload = req.body;
    const response = await controller.injectLead(payload)
    res.status(200).json(
        response
    )
})
router.get("/status/:id", async (req, res) => {
    // #swagger.tags = ['Job']
    // #swagger.description = 'all sip peers.'
    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/Inject" },
        description: "all sip peers." } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    const payload = req.params;
    const response = await controller.jobStat(payload)
    res.status(200).json(
        response
    )
})
router.delete("/phone-call/:jobId/:id", async (req, res) => {
    // #swagger.tags = ['Job']
    // #swagger.description = 'all sip peers.'
    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/SipPeers" },
        description: "all sip peers." } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    const payload = req.params;
    const response = await controller.deletePhoneCall(payload)
    res.status(200).json(
        response
    )
})
router.delete("/inactive-job/:id", async (req, res) => {
    // #swagger.tags = ['Job']
    // #swagger.description = 'all sip peers.'
    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/SipPeers" },
        description: "all sip peers." } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    const payload = req.params;
    const response = await controller.delInActJob(payload)
    res.status(200).json(
        response
    )
})
module.exports = router;
