
const express = require("express");
const router = express.Router();
const controller = require("./controller");
// const { isAuthorized } = require("../../middlewares/auth");
router.post("/", async (req, res) => {
    // #swagger.tags = [users]
    // #swagger.description = 'create new out dial jobs.'
    /*	#swagger.parameters['obj'] = {
               in: 'body',
               description: 'User information.',
               required: true,
               schema: { $ref: "#/definitions/CreateUser" }
       } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    const payload = req.body;
    console.log("req.body", req.body)
    const response = await controller.create(payload)
    res.status(200).json(response);
});
router.put("/:id", async (req, res) => {
    // #swagger.tags = [users]
    // #swagger.description = 'update outbound job by id.'
    /*	#swagger.parameters['obj'] = {
               in: 'body',
               description: 'User information.',
               required: true,
               schema: { $ref: "#/definitions/UpdateJob" }
       } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    const payload = { ...req.body, id: req.params.id };
    const response = await controller.update(payload)
    res.status(201).json(response);
});
router.delete("/:id", async (req, res) => {
    // #swagger.tags = [users]
    // #swagger.description = 'all sip peers.'
    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/SipPeers" },
        description: "all sip peers." } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    const payload = { id: req.params.id };
    const response = await controller.delete(payload)
    res.status(200).json({
        response
    })
});
router.get("/", async (req, res) => {
    // #swagger.tags = [users]
    // #swagger.description = 'all sip peers.'
    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/SipPeers" },
        description: "all sip peers." } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    // const payload = { id: req.params.id };
    const response = await controller.get()
    res.status(200).json({
        response
    })
});
router.get("/:id", async (req, res) => {
    // #swagger.tags = [users]
    // #swagger.description = 'all sip peers.'
    /* #swagger.responses[200] = { 
        schema: { "$ref": "#/definitions/SipPeers" },
        description: "all sip peers." } */
    /* #swagger.security = [{
              "apiKeyAuth": []
      }] */
    // const payload = { id: req.params.id };
    const response = await controller.getById(req.params)
    res.status(200).json({
        response
    })
});
router.post("/token", async (req, res) => {
    /* 	#swagger.tags = ['user']
          #swagger.description = 'Endpoint to sign in a specific user' */
    /*	#swagger.parameters['obj'] = {
                 in: 'body',
                 description: 'User information.',
                 required: true,
                 schema: { $ref: "#/definitions/AddUser" }
         } */
    const response = await controller.getRefreshToken(req.body);
    res.status(200).json(
        response
    );
})
router.post("/sign-in", async (req, res) => {
    /* 	#swagger.tags = ['user']
          #swagger.description = 'Endpoint to sign in a specific user' */
    /*	#swagger.parameters['obj'] = {
                 in: 'body',
                 description: 'User information.',
                 required: true,
                 schema: { $ref: "#/definitions/AddUser" }
         } */
    const response = await controller.signin(req.body);
    res.status(200).json(response);
})

router.post("/app/sign-in", async (req, res) => {
    /* 	#swagger.tags = ['user']
          #swagger.description = 'Endpoint to sign in a specific user' */
    /*	#swagger.parameters['obj'] = {
                 in: 'body',
                 description: 'User information.',
                 required: true,
                 schema: { $ref: "#/definitions/AddUser" }
         } */
    const response = await controller.signInApp(req.body);
    res.status(200).json(
        response
    );
})

router.get("/dashboard/stats", async (req, res) => {
    /* 	#swagger.tags = ['user']
          #swagger.description = 'Endpoint to sign in a specific user' */
    /*	#swagger.parameters['obj'] = {
                 in: 'body',
                 description: 'User information.',
                 required: true,
                 schema: { $ref: "#/definitions/AddUser" }
         } */
    const response = await controller.dashboardStats();
    res.status(200).json(
        response
    );
})


module.exports = router;
