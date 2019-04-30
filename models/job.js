var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var JobSchema = new Schema({
    title: {type: String, required: true},
    builder: { type: Schema.ObjectId, ref: 'Builder', required: false },
    number: {type: String, required: true},
    dateOf: {type: Date, default: Date.now},
    jobLoc: {type: String},
    addendum: { type: Schema.ObjectId, ref: 'Addendum', required: false },
    // tenDate: [{
    //   date :{type: Date},
    //   disc :{type: String}
    // }],
    // addArr: [{
    //   titleA :{type:String},
    //   discD :{type:String}
    // }],
    region: [{ type: Schema.ObjectId, ref: 'Region' }]
        
});

// Virtual for this job instance URL.
JobSchema
.virtual('url')
.get(function () {
  return '/catalog/job/'+this._id;
});

// Export model.
module.exports = mongoose.model('Job', JobSchema);
