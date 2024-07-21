
const { Model } = require('objection');
class model extends Model {
    static get tableName() {
        return 'job_types';
    }

}
module.exports = model;
