var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var JobInstanceSchema = new Schema({
    job: { type: Schema.ObjectId, ref: 'Job', required: true }, // Reference to the associated job.
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum:['Ready', 'On Hold', 'In Progress', 'Scheduled'], default:'Scheduled'},
    due_back: { type: Date, default: Date.now },
});

// Virtual for this jobinstance object's URL.
JobInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/jobinstance/'+this._id;
});


JobInstanceSchema
.virtual('due_back_formatted')
.get(function () {
  return moment(this.due_back).format('MMMM Do, YYYY');
});

JobInstanceSchema
.virtual('due_back_yyyy_mm_dd')
.get(function () {
  return moment(this.due_back).format('YYYY-MM-DD');
});


// Export model.
module.exports = mongoose.model('JobInstance', JobInstanceSchema);
