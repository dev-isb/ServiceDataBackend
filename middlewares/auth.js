const jwtService = require("./jwt");

//Basic c3lzdGVtOjU4OVNhbFJVSERERGRLTjZzRVM=
const systemCredentials = {
    username: "system",
    password: "589SalRUHDDDdKN6sES"
}


function isAuthorized(req, res, next) {
    const { authorization } = req.headers;
    const authToken = String(authorization).split(" ");

    if (['Bearer', 'Basic'].indexOf(authToken[0]) < 0) return res.status(403).send('No credentials sent!');

    if (authToken[0] == "Bearer") {


        const decoded = jwtService.verifyToken(authToken[1]);

        if (!decoded) {
            return res.status(404).send({
                success: false,
                message: "Unauthorized",
            });
        }

        req["user"] = decoded.data;

        return next();
    }
    else if (authToken[0] == "Basic") {


        // if (!isAllowed) return res.status(401).send('Unauthorized');

        const buff = Buffer.from(authToken[1], 'base64');
        const userCred = buff.toString('utf8');
        const userCredParts = userCred.split(':');

        if (userCredParts.length !== 2) return res.status(403).send('No credentials sent!');
        if (userCredParts[0] !== systemCredentials.username) return res.status(404).send({
            success: false,
            message: "Unauthorized",
        });
        if (userCredParts[1] !== systemCredentials.password) return res.status(404).send({
            success: false,
            message: "Unauthorized",
        });

        let userData = {};

        userData['username'] = 'system';
        userData['operatorId'] = null;
        userData['userType'] = 'system';

        req.user = userData;

        return next();

    }
    else {
        return res.status(400).send({
            success: false,
            message: "Unauthorized",
        });
    }


}

module.exports = {
    isAuthorized,
};
