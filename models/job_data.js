
const { Model } = require('objection');
class model extends Model {
    static get tableName() {
        return 'job_data';
    }
    $beforeUpdate() {
        this.updateDt = new Date();
    }
}
module.exports = model;
