
const { Model } = require('objection');
class model extends Model {
    static get tableName() {
        return 'users';
    }
    $beforeUpdate() {
        this.updateDt = new Date();
    }
}
module.exports = model;
