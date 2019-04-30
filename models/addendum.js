var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var AddendumSchema = new Schema({
    job: { type: Schema.ObjectId, ref: 'Job', required: true }, // Reference to the associated job.
    dateCreated: {type: Date, default: Date.now},
    status: {type: String, required: true, enum:['Approved', 'Maintenance', 'Loaned', 'Reserved'], default:'Maintenance'},
    clause: { type: String, required: true },
   
});

// Virtual for this Contract object's URL.
AddendumSchema
.virtual('url')
.get(function () {
  return '/catalog/addendum/'+this._id;
});


AddendumSchema
.virtual('dateCreated_formatted')
.get(function () {
  return moment(this.due_back).format('MMMM Do, YYYY');
});



// Export model.
module.exports = mongoose.model('JobInstance', AddendumSchema);
