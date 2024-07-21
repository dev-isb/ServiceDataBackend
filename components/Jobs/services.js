const services = {}
const moment = require('moment');
const { raw } = require('objection');
const job = require("../../models/jobs");
const jobTypes = require("../../models/job_types");
const cdrModel = require("../../models/cdr");
const jobData = require("../../models/job_data");
const config = require("../../config/config.json");
const { callbackUrl: callbackURL } = config;
services.createJob = async (payload) => {
    const { startTime = null, endTime = null } = payload;
    if (startTime) payload.startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
    if (endTime) payload.endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
    const response = await job.query().insertGraphAndFetch(payload);
    return response;
}
services.jobCdrs = async (payload) => {
    const { limit = null, offset = null, jobId = null } = payload;
    const jobCdrDispositionsQuery = cdrModel.query()
        .select({
            totalRecords: raw(`count('*')`),
            disposition: 'disposition'
        })
        .whereNotNull('jobId')
        .groupBy('disposition');
    const jobCdrsQuery = cdrModel.query()
        .alias('t1')
        .select({
            callDate: raw(`DATE_FORMAT(calldate, '%Y-%m-%d %H:%i:%s')`),
            source: 'fromNumber',
            destination: 'dst',
            disposition: 'disposition',
            duration: 'duration',
            billsec: 'billsec',
            uniqueId: 'uniqueid',
            jobId: 'jobId',
            toNumber: 'toNumber',
            // sipLeadId: raw(`(Select slp_lead_id from job_data t2 where t1.to_number = t2.number AND t1.job_id = t2.job_id limit 1)`),
            agentExtension: raw(`SUBSTRING_INDEX(SUBSTRING_INDEX(dstchannel, '@', 1), '/',-1)`),
            // amdStatus: 'amdStatus'
        })
        .whereNotNull('jobId')
        .orderBy('callDate', 'DESC');
    const jobCdrsCountQuery = cdrModel.query().count({ totalRecords: '*' }).whereNotNull('jobId').first();
    if (limit && offset) jobCdrsQuery.limit(limit).offset(offset);
    if (jobId) {
        jobCdrsQuery.where({ jobId });
        jobCdrsCountQuery.where({ jobId });
        jobCdrDispositionsQuery.where({ jobId });
    }
    const [jobCdrs, { totalRecords }, jobCdrDispositions] = await Promise.all([jobCdrsQuery, jobCdrsCountQuery, jobCdrDispositionsQuery]);
    return { jobCdrs, jobCdrDispositions, totalRecords };
}
services.deleteJobCdrById = async (payload) => {
    const response = await cdrModel.query().delete().where({ uniqueid: payload.id });
    return response;
}
services.deleteJobCdrByJobId = async (payload) => {
    const response = await cdrModel.query().delete().where({ jobId: payload.jobId });
    return response;
}
services.getJobs = async (payload) => {
    const { limit = null, offset = null, jobId = null } = payload;
    const jobsQuery = job.query()
        .select({
            id: 'id',
            title: 'name',
            type: 'type',
            state: 'complete',
            active: 'active',
            queue: 'queue',
            pause: 'pause',
            frequency: 'frequency',
            concurrency: 'concurrency',
            createdDate: raw(`DATE_FORMAT(create_dt, '%Y-%m-%d %H:%i:%s')`),
            startTime: raw(`DATE_FORMAT(start_time, '%Y-%m-%d %H:%i:%s')`),
            endTime: raw(`DATE_FORMAT(end_time, '%Y-%m-%d %H:%i:%s')`)
        })
        //.withGraphFetched('jobData')
        .orderBy('createDt', 'DESC');
    const jobsCountQuery = job.query().count({ totalRecords: '*' }).first();
    if (limit && offset) jobsQuery.limit(limit).offset(offset);
    if (jobId) {
        jobsQuery.where({ jobId });
        jobsCountQuery.where({ jobId });
    }
    const [jobs, { totalRecords }] = await Promise.all([jobsQuery, jobsCountQuery]);
    return { jobs, totalRecords };
}
services.getJobById = async (payload) => {
    const { id } = payload;
    const response = await job.query().withGraphFetched('jobData').where({ id });
    return response
}
services.updateJob = async (payload) => {
    console.log("updateJob", payload);
    const { startTime = null, endTime = null } = payload;
    if (startTime) payload.startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
    if (endTime) payload.endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
    const response = await job.query().upsertGraphAndFetch(payload);
    return response;
}
services.updateJobFields = async (payload) => {
    const { active = null, startTime = null, endTime = null, id, pause = null, type = null, name = null, complete = null, frequency = null, concurrency = null } = payload;
    const updateData = {};
    if (startTime) updateData.startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
    if (endTime) updateData.endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
    if (pause || pause == 0) updateData.pause = pause;
    if (type) updateData.type = type;
    if (name) updateData.name = name;
    if (complete) updateData.complete = complete;
    if (frequency) updateData.frequency = frequency;
    if (concurrency) updateData.concurrency = concurrency;
    if (active || active == 0) updateData.active = active;
    const response = await job.query().updateAndFetchById(id, updateData);
    return response;
}
services.delete = async (payload) => {
    console.log("id is :", payload.id);
    const response = await job.query().deleteById(payload.id)
    return response;
}
services.jobTypes = async () => {
    const response = await jobTypes.query().select();
    return response;
}
services.injectLead = async (payload) => {
    const {
        jobId,
        first
    } = payload;
    delete payload.first;
    const response = await job.query().where({ id: jobId }).first()
    if (!(response && Object.keys(response).length > 0)) {
        return {
            success: false,
            message: "no job found for job id :" + jobId
        }
    }
    payload.index = 0;
    if (first) {
        payload.inject = 0;
        payload.completed = 1;
    }
    else {
        payload.inject = 1;
    }


    await jobData.query().insert(payload)
    const { complete, active, startTime, endTime } = response;
    const update = {
        id: jobId
    }
    if (complete) {
        update.complete = 0;
    }
    if (active && complete) {
        update.active = 0;
    }
    const start = moment(startTime);
    const end = moment(endTime);
    const now = moment();
    if (!(now.isBetween(start, end))) {
        update.endTime = moment().add(moment.duration(1, 'days')).format("YYYY-MM-DD");
    }
    update.id = jobId;
    const updatingValues = await job.query().upsertGraphAndFetch(update)


    if (first) await callOriginator({ ...payload, queue: response?.queue });

    return updatingValues
}
services.jobStat = async (payload) => {
    const { id } = payload;
    const totalCount = await jobData.query().count().where({ jobId: id }).first();
    if (!(totalCount && Object.keys(totalCount).length)) return null
    const indexId = await jobData.query().where({ jobId: id, index: 1 }).first();
    const checkJob = await job.query().where({ id }).first();
    // if(checkJob?.complete)
    if (indexId && Object.keys(indexId).length) {
        const totalCountExecuted = await jobData.query().count().where({ jobId: id }).whereRaw(`id < ${indexId.id}`).first();
        const totalCountToBeExecuted = await jobData.query().count().where({ jobId: id }).whereRaw(`id > ${indexId.id}`).first();
        return {
            totalCount: totalCount['count(*)'],
            executed: checkJob?.complete && totalCountExecuted['count(*)'] == 0 ? totalCount['count(*)'] : totalCountExecuted['count(*)'],
            remaining: totalCountToBeExecuted['count(*)'],
            // jobStatus:
        }
    } else {
        return {
            totalCount: totalCount['count(*)']
        }
    }
}
const callOriginator = async (originatePayload) => {
    const { number, trunk, mask, context, exten, jobId: jobDataId, slpLeadId, callbackUrl } = originatePayload;
    return new Promise((resolve, reject) => {
        // console.log({
        //     'action': 'originate',
        //     'channel': trunk ? `SIP/${number}@${trunk}` : `pjsip/${number}`,
        //     'context': 'AMD_TEST',
        //     'callerId': mask,
        //     'exten': '1088',
        //     'priority': 1,
        //     'async': true,
        //     'variable': {
        //         'CDR(job_id)': jobDataId,
        //         'actualContext': context,
        //         'actualExtension': exten,
        //         'CDR(to_number)': number,
        //         'CDR(from_number)': mask,
        //         'toNumber': number,
        //         'fromNumber': mask,
        //         'CDR(sip_lead_id)': slpLeadId || null,
        //         'slpId': slpLeadId || null,
        //         'trunk': trunk,
        //         'jobId': jobDataId,
        //         'callbackUrl': callbackUrl || callbackURL
        //     }
        // })
        setTimeout(() => {
            AMI.action({
                'action': 'originate',
                'channel': trunk ? `SIP/${number}@${trunk}` : `pjsip/${number}`,
                'context': 'AMD_TEST',
                'callerId': mask,
                'exten': '1088',
                'priority': 1,
                'async': true,
                'variable': {
                    'CDR(job_id)': jobDataId,
                    'actualContext': context,
                    'actualExtension': exten,
                    'CDR(to_number)': number,
                    'CDR(from_number)': mask,
                    'toNumber': number,
                    'fromNumber': mask,
                    // 'CDR(sip_lead_id)': slpLeadId || null,
                    // 'slpId': slpLeadId || null,
                    'trunk': trunk,
                    'jobId': jobDataId,
                    // 'callbackUrl': callbackUrl || callbackURL
                }
            }, function (err, res) {
                if (err) {
                    console.log("errror :", err)
                }
                if (res?.response == 'Success') {
                    console.log("call originated successfully")
                }
                else {
                    console.log("call failed :", res);
                }
                resolve("originated");
            });
        }, 10);

    })
}
services.deletePhoneCall = async (payload) => {
    const { jobId, id } = payload;
    const cJob = await job.query().where({ id: jobId }).first();
    if (!(cJob && Object.keys(cJob).length)) {
        return;
    }
    const { complete, pause } = cJob;
    if (complete == 1 || pause == 1) {
        const response = await jobData.query().deleteById(id);
        return response;
    }
    return
}
services.delInActJob = async (payload) => {
    const { id } = payload;
    const cJob = await job.query().where({ id }).first();
    if (!(cJob && Object.keys(cJob).length)) {
        return;
    }
    const { complete, pause } = cJob;
    if (complete == 1 || pause == 1) {
        const response = await job.query().deleteById(id);
        return response;
    }
    return
}

module.exports = services;