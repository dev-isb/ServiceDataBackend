
const { Model } = require('objection');
class model extends Model {
    static get tableName() {
        return 'jobs';
    }


    static get relationMappings() {
        const jobTypes = require("./job_types");
        const jobData = require("./job_data");
        return {
            jobTypes: {
                relation: Model.HasOneRelation,
                modelClass: jobTypes,
                join: {
                    from: "jobs.type",
                    to: "job_types.name",
                },
            },
            jobData: {
                relation: Model.HasManyRelation,
                modelClass: jobData,
                join: {
                    from: "jobs.id",
                    to: "job_data.jobId",
                },
            }
        };
    }


}
module.exports = model;
