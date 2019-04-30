var Region = require('../models/region');
var Job = require('../models/job');
var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Region.
exports.region_list = function(req, res, next) {

  Region.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_regions) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('region_list', { title: 'Region List', list_regions:  list_regions});
    });

};

// Display detail page for a specific Region.
exports.region_detail = function(req, res, next) {

    async.parallel({
        region: function(callback) {

            Region.findById(req.params.id)
              .exec(callback);
        },

        region_jobs: function(callback) {
          Job.find({ 'region': req.params.id })
          .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.region==null) { // No results.
            var err = new Error('Region not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('region_detail', { title: 'Region Detail', region: results.region, region_jobs: results.region_jobs } );
    });

};

// Display Region create form on GET.
exports.region_create_get = function(req, res, next) {
    res.render('region_form', { title: 'Create Region'});
};

// Handle Region create on POST.
exports.region_create_post = [

    // Validate that the name field is not empty.
    body('name', 'Region name required').isLength({ min: 1 }).trim(),

    // Sanitize (trim) the name field.
    sanitizeBody('name').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a region object with escaped and trimmed data.
        var region = new Region(
          { name: req.body.name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('region_form', { title: 'Create Region', region: region, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid.
            // Check if Region with same name already exists.
            Region.findOne({ 'name': req.body.name })
                .exec( function(err, found_region) {
                     if (err) { return next(err); }

                     if (found_region) {
                         // Region exists, redirect to its detail page.
                         res.redirect(found_region.url);
                     }
                     else {

                         region.save(function (err) {
                           if (err) { return next(err); }
                           // Region saved. Redirect to region detail page.
                           res.redirect(region.url);
                         });

                     }

                 });
        }
    }
];

// Display Region delete form on GET.
exports.region_delete_get = function(req, res, next) {

    async.parallel({
        region: function(callback) {
            Region.findById(req.params.id).exec(callback);
        },
        region_jobs: function(callback) {
            Job.find({ 'region': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.region==null) { // No results.
            res.redirect('/catalog/regions');
        }
        // Successful, so render.
        res.render('region_delete', { title: 'Delete Region', region: results.region, region_jobs: results.region_jobs } );
    });

};

// Handle Region delete on POST.
exports.region_delete_post = function(req, res, next) {

    async.parallel({
        region: function(callback) {
            Region.findById(req.params.id).exec(callback);
        },
        region_jobs: function(callback) {
            Job.find({ 'region': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.region_jobs.length > 0) {
            // Region has jobs. Render in same way as for GET route.
            res.render('region_delete', { title: 'Delete Region', region: results.region, region_jobs: results.region_jobs } );
            return;
        }
        else {
            // Region has no jobs. Delete object and redirect to the list of regions.
            Region.findByIdAndRemove(req.body.id, function deleteRegion(err) {
                if (err) { return next(err); }
                // Success - go to regions list.
                res.redirect('/catalog/regions');
            });

        }
    });

};

// Display Region update form on GET.
exports.region_update_get = function(req, res, next) {

    Region.findById(req.params.id, function(err, region) {
        if (err) { return next(err); }
        if (region==null) { // No results.
            var err = new Error('Region not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('region_form', { title: 'Update Region', region: region });
    });

};

// Handle Region update on POST.
exports.region_update_post = [
   
    // Validate that the name field is not empty.
    body('name', 'Region name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (escape) the name field.
    sanitizeBody('name').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a region object with escaped and trimmed data (and the old id!)
        var region = new Region(
          {
          name: req.body.name,
          _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('region_form', { title: 'Update Region', region: region, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Region.findByIdAndUpdate(req.params.id, region, {}, function (err,theregion) {
                if (err) { return next(err); }
                   // Successful - redirect to region detail page.
                   res.redirect(theregion.url);
                });
        }
    }
];
