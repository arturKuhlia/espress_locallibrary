var mongoose = require('mongoose');
var moment = require('moment'); // For date handling.

var Schema = mongoose.Schema;

var BuilderSchema = new Schema(
    {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    discription: { type: String, required: false, max: 100}
    }
  );

// Virtual for builder "full" name.
BuilderSchema
.virtual('name')
.get(function () {
  return this.first_name +', '+this.family_name;
});

// Virtual for this builder instance URL.
BuilderSchema
.virtual('url')
.get(function () {
  return '/catalog/builder/'+this._id
});




// Export model.
module.exports = mongoose.model('Builder', BuilderSchema);
