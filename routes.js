const express = require("express");
const { isAuthorized } = require('./middlewares/auth');

const router = express.Router();

//const ami = require("./components/AMI/router");
const apiV3 = require("./components/Users/router");
const jobs = require("./components/Jobs/router");

// router.use(apiV1);
// router.use(apiV1);
// router.use((req, res, next) => {
//     console.log(req.headers);
//     next()
// })

router.use("/user", apiV3);
// router.use("/ami", ami);
router.use("/job", isAuthorized, jobs)
// // router.use(apiV3);

// router.get("/test-get", ToolsController.show);
// router.post("/test-post", store);
// router.delete("/test-delete/:id", ToolsController.delete);


module.exports = router;
