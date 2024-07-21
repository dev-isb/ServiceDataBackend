
const services = {}
const moment = require('moment');
const jwtService = require("../../middlewares/jwt");
const bcryptService = require("../../middlewares/bcrypt");
const model = require("../../models/users.js");
const cdrModel = require("../../models/cdr.js");
const jobsModel = require("../../models/jobs.js");
const { raw } = require('objection');
services.create = async (payload) => {
    console.log("payload", payload)
    const foundRecord = await model.query().where({ email: payload.email }).first();
    if (foundRecord && Object.keys(foundRecord).length > 0) {
        return {
            success: false,
            message: "User already subscribed",
            email: payload.username
        };
    }
    const pwdHash = await bcryptService.generatePasswordHash(payload.password);
    payload.password = pwdHash;
    const response = await model.query().insertGraphAndFetch(payload);
    return response;
}
services.get = async () => {
    const response = await model.query();
    return response;
}
services.getById = async (payload) => {
    const { id } = payload;
    const response = await model.query().where({ id });
    return response
}
services.update = async (payload) => {
    const { startTime, endTime } = payload;
    if (startTime) payload.startTime = moment(startTime).format('yyyy-MM-DD HH:mm:ss');
    if (endTime) payload.endTime = moment(endTime).format('yyyy-MM-DD HH:mm:ss');
    const response = await model.query().upsertGraphAndFetch(payload);
    return response;
}
services.delete = async (payload) => {
    const response = await model.query().deleteById(payload.id)
    return response;
}
services.signIn = async ({ username, password }) => {
    const foundUser = await model.query().where({ email: username }).first();
    if (!foundUser) {
        return null
    }
    const isPwdOk = await bcryptService.validatePassword(
        password,
        foundUser.password
    );
    console.log(foundUser.email, 'checking password', isPwdOk);
    if (isPwdOk) {
        const token = jwtService.getToken({ username: foundUser.email, id: foundUser.id });
        const refreshToken = jwtService.refreshToken({ username: foundUser.email, id: foundUser.id, token })
        const lastSignin = new Date();
        return {
            token: token,
            refreshToken,
            username: foundUser.email,
            lastSigninDt: lastSignin,
            createdAt: foundUser.created_at,
        }
    }
    return false;
}
// signInApp
services.signInApp = async ({ msisdn, username }) => {
    const foundUser = await model.query().where({ msisdn, username }).first();
    if (!foundUser) {
        return null
    }
    const token = jwtService.getToken({
        user: foundUser.username,
    });
    const refreshToken = jwtService.refreshToken({ user: foundUser.username, token })
    const lastSignin = new Date();
    return {
        token: token,
        refreshToken,
        username: foundUser.username,
        lastSigninDt: lastSignin,
        createdAt: foundUser.created_at,
    }
    // }
    // return false;
}

services.getRefreshToken = async (payload) => {

    const { refreshToken } = payload;
    const decodedToken = jwtService.verifyToken(refreshToken);
    if (!decodedToken) return false;

    const user = await model.query().where({ id: decodedToken.id }).first();
    if (!user) return false;

    const token = jwtService.getToken({ username: user.email, id: user.id });

    return {
        token,
        refreshToken,
        username: user.email
    }
}

services.dashboardStats = async () => {

    const cdrJobDispositionsQuery = cdrModel.query()
        .select({
            totalRecords: raw(`count('*')`),
            callStatus: 'disposition'
        })
        .whereNotNull('jobId')
        .groupBy('disposition');

    const totalJobsQuery = jobsModel.query().count({ totalJobs: '*' }).first();
    const completedJobsQuery = jobsModel.query().count({ completedJobs: '*' }).where({ complete: 1 }).first();

    const activeJobsQuery = jobsModel.query().count({ activeJobs: '*' }).where({ complete: 0 }).whereRaw(`DATE(create_dt) = DATE(NOW())`).first();
    const inactiveJobsQuery = jobsModel.query().count({ inactiveJobs: '*' }).whereNull('complete').whereRaw(`DATE(create_dt) = DATE(NOW())`).first();

    const [cdrJobDispositions, { totalJobs }, { completedJobs }, { activeJobs }, { inactiveJobs }] = await Promise.all([cdrJobDispositionsQuery, totalJobsQuery, completedJobsQuery, activeJobsQuery, inactiveJobsQuery]);

    return { cdrJobDispositions, totalJobs, completedJobs, activeJobs, inactiveJobs };

}
module.exports = services;
