var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RegionSchema = new Schema({
    name: {type: String, required: true, min: 3, max: 100}
});

// Virtual for this region instance URL.
RegionSchema
.virtual('url')
.get(function () {
  return '/catalog/region/'+this._id;
});

// Export model.
module.exports = mongoose.model('Region', RegionSchema);
