const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { isAuthorized } = require("../../middlewares/auth");

router.get("/summary", isAuthorized, async (req, res) => {
    /* 	#swagger.tags = ['AMI']
          #swagger.description = 'queue summary' */


    /* #swagger.responses[200] = { 
          schema: { "$ref": "#/definitions/Summary" },
          description: "status of queues." } */

    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */

    const response = await controller.getQueueSummary()
    res.status(200).json({
        response
    })


});

router.get("/summary/:name", isAuthorized, async (req, res) => {
    // #swagger.tags = ['AMI']
    // #swagger.description = 'status of queues.'


    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/Status" },
        description: "status of queues." } */

    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */

    const response = await controller.getSummaryName(req.params)
    res.status(200).json({
        response
    })

});

router.get("/status/:name", isAuthorized, async (req, res) => {
    // #swagger.tags = ['AMI']
    // #swagger.description = 'status of queues.'


    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/Status" },
        description: "status of queues." } */

    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */

    const response = await controller.getQueueByName(req.params)
    res.status(200).json({
        response
    })

});

router.post("/logout-agent", isAuthorized, async (req, res) => {
    // #swagger.tags = ['AMI']
    // #swagger.description = 'logs out agent.'

    /*	#swagger.parameters['obj'] = {
                 in: 'body',
                 description: 'User information.',
                 required: true,
                 schema: { $ref: "#/definitions/AgentLogOut" }
         } */

    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */

    const response = await controller.logoutAgent(req.body)
    res.status(200).json({
        response
    })

});

router.post("/pause/", isAuthorized, async (req, res) => {

    // #swagger.tags = ['AMI']
    // #swagger.description = 'status of queues.'


    /*	#swagger.parameters['obj'] = {
               in: 'body',
               description: 'User information.',
               required: true,
               schema: { $ref: "#/definitions/Pause" }
       } */


    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */

    const response = await controller.pauseQueue(req.body)
    res.status(200).json({
        response
    })

})

router.post("/un-pause/", isAuthorized, async (req, res) => {

    // #swagger.tags = ['AMI']
    // #swagger.description = 'status of queues.'

    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'User information.',
            required: true,
            schema: { $ref: "#/definitions/UnPause" }
    } */


    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */

    const response = await controller.unPauseQueue(req.body)
    res.status(200).json({
        response
    })

})

router.post("/un-pause-memeber/", isAuthorized, async (req, res) => {

    // #swagger.tags = ['AMI']
    // #swagger.description = 'status of queues.'


    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'User information.',
            required: true,
            schema: { $ref: "#/definitions/UnPauseMemeber" }
    } */


    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */

    const response = await controller.unPauseSingle(req.body)
    res.status(200).json({
        response
    })

})

router.post("/pause-memeber/", isAuthorized, async (req, res) => {

    // #swagger.tags = ['AMI']
    // #swagger.description = 'status of queues.'



    /*	#swagger.parameters['obj'] = {
             in: 'body',
             description: 'User information.',
             required: true,
             schema: { $ref: "#/definitions/PauseMemeber" }
     } */



    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */

    const response = await controller.pauseSingle(req.body)
    res.status(200).json({
        response
    })

})

router.post("/call-originate/", async (req, res) => {

    // #swagger.tags = ['AMI']
    // #swagger.description = 'status of queues.'


    /*	#swagger.parameters['obj'] = {
                 in: 'body',
                 description: 'User information.',
                 required: true,
                 schema: { $ref: "#/definitions/Originate" }
         } */



    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */

    const response = await controller.callOriginate(req.body)
    res.status(200).json({
        response
    })

})

router.post("/call-barge/", isAuthorized, async (req, res) => {

    // #swagger.tags = ['AMI']
    // #swagger.description = 'status of queues.'



    /*	#swagger.parameters['obj'] = {
                 in: 'body',
                 description: 'User information.',
                 required: true,
                 schema: { $ref: "#/definitions/Barge" }
         } */

    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */

    const response = await controller.callBarge(req.body)
    res.status(200).json({
        response
    })

})

router.post("/call-spy/", isAuthorized, async (req, res) => {

    // #swagger.tags = ['AMI']
    // #swagger.description = 'status of queues.'



    /*	#swagger.parameters['obj'] = {
                 in: 'body',
                 description: 'User information.',
                 required: true,
                 schema: { $ref: "#/definitions/Spy" }
         } */



    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */

    const response = await controller.callBarge(req.body)
    res.status(200).json({
        response
    })

})
// getQueueByName

router.get("/status", isAuthorized, async (req, res) => {
    // #swagger.tags = ['AMI']
    // #swagger.description = 'status of queues.'


    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/Status" },
        description: "status of queues." } */

    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */

    const response = await controller.getQueueStatus()
    res.status(200).json({
        response
    })

});

router.get("/channels/:name", isAuthorized, async (req, res) => {
    // #swagger.tags = ['AMI']
    // #swagger.description = 'all current channels running on machine.'


    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/Channel" },
        description: "all current channels running on machine." } */

    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */

    const response = await controller.getCoreShowChannelsByName(req.params)
    console.log(response);
    res.status(201).json(response);


});

router.get("/channels", isAuthorized, async (req, res) => {
    // #swagger.tags = ['AMI']
    // #swagger.description = 'all current channels running on machine.'


    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/Channel" },
        description: "all current channels running on machine." } */

    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */

    const response = await controller.getCoreShowChannels()
    console.log(response);
    res.status(201).json(response);


});

router.get("/sip-peers", async (req, res) => {
    // #swagger.tags = ['AMI']
    // #swagger.description = 'all sip peers.'


    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/SipPeers" },
        description: "all sip peers." } */


    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */


    const response = await controller.sipShowPeers()
    res.status(200).json({
        response
    })

});

router.get("/cel-events", isAuthorized, async (req, res) => {
    // #swagger.tags = ['AMI']
    // #swagger.description = 'all sip peers.'


    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/SipPeers" },
        description: "all sip peers." } */


    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */


    const response = await controller.getCelEvents()
    res.status(200).json({
        response
    })

});

router.get("/cdr-events", isAuthorized, async (req, res) => {
    // #swagger.tags = ['AMI']
    // #swagger.description = 'all sip peers.'


    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/SipPeers" },
        description: "all sip peers." } */

    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */


    const response = await controller.getCdrEvents()
    res.status(200).json({
        response
    })

});

router.post("/bridge", isAuthorized, async (req, res) => {
    // #swagger.tags = ['AMI']
    // #swagger.description = 'all sip peers.'

    /*	#swagger.parameters['obj'] = {
                 in: 'body',
                 description: 'User information.',
                 required: true,
                 schema: { $ref: "#/definitions/Bridge" }
         } */


    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */


    const response = await controller.bridge(req.body)
    res.status(200).json({
        response
    })

});

router.post("/redirect", isAuthorized, async (req, res) => {
    // #swagger.tags = ['AMI']
    // #swagger.description = 'all sip peers.'


    /*	#swagger.parameters['obj'] = {
                 in: 'body',
                 description: 'User information.',
                 required: true,
                 schema: { $ref: "#/definitions/Redirect" }
         } */


    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */


    const response = await controller.redirect(req.body)
    res.status(200).json({
        response
    })

});

module.exports = router;
