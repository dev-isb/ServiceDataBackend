const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || "password";
const log = console.log;
const tokenList = {};

module.exports = {
    getToken: (data) => {
        console.log("data :", data);
        const token = jwt.sign({ ...data }, secretKey, { expiresIn: 180 * 60 });
        return token;
    },
    verifyToken: (token) => {
        try {
            var decoded = jwt.verify(token, secretKey);
            if (decoded) {
                return decoded;
            } else {
                return null;
            }
        } catch (err) {
            log(`[TOKEN ERROR] [${err.message}]`);
            return null;
        }
    },
    refreshToken: (data) => {
        const refreshToken = jwt.sign({ username: data.email, id: data.id }, secretKey, { expiresIn: 200 * 200 })
        const response = {
            "status": "Logged in",
            "token": data.token,
            "refreshToken": refreshToken,
        }
        tokenList[refreshToken] = response;
        return refreshToken
    },
    checkRefreshToken: (refreshToken, user) => {
        if (refreshToken in tokenList) {

            const token = jwt.sign({ username: user.email, id: user.id }, secretKey, { expiresIn: 60 * 60 })
            const response = { token };
            // update the token in the list
            tokenList[refreshToken].token = token
            // res.status(200).json(response);
            return response

        }
        else {
            return false;
        }
    },
    decodeWebToken: (token) => {

        const decoded = jwt.decode(token, pass);
        return decoded;

    }

}