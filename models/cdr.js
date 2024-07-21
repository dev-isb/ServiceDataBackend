
const { Model } = require('objection');
class model extends Model {
    static get tableName() {
        return 'cdr';
    }

}
module.exports = model;
