var Builder = require('../models/builder')
var async = require('async')
var Job = require('../models/job')

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Builders.
exports.builder_list = function (req, res, next) {

    Builder.find()
        .sort([['family_name', 'ascending']])
        .exec(function (err, list_builders) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('builder_list', { title: 'Builder List', builder_list: list_builders });
        })

};

// Display detail page for a specific Builder.
exports.builder_detail = function (req, res, next) {

    async.parallel({
        builder: function (callback) {
            Builder.findById(req.params.id)
                .exec(callback)
        },
        builders_jobs: function (callback) {
            Job.find({ 'builder': req.params.id }, 'title summary')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.builder == null) { // No results.
            var err = new Error('Builder not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('builder_detail', { title: 'Builder Detail', builder: results.builder, builder_jobs: results.builders_jobs });
    });

};

// Display Builder create form on GET.
exports.builder_create_get = function (req, res, next) {
    res.render('builder_form', { title: 'Create Builder' });
};

// Handle Builder create on POST.
exports.builder_create_post = [

    // Validate fields.


    // Sanitize fields.
    sanitizeBody('first_name').escape(),
    sanitizeBody('family_name').escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        // Create Builder object with escaped and trimmed data
        var builder = new Builder(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                discription: req.body.discription,
          
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('builder_form', { title: 'Create Builder', builder: builder, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save builder.
            builder.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new builder record.
                res.redirect(builder.url);
            });
        }
    }
];



// Display Builder delete form on GET.
exports.builder_delete_get = function (req, res, next) {

    async.parallel({
        builder: function (callback) {
            Builder.findById(req.params.id).exec(callback)
        },
        builders_jobs: function (callback) {
            Job.find({ 'builder': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.builder == null) { // No results.
            res.redirect('/catalog/builders');
        }
        // Successful, so render.
        res.render('builder_delete', { title: 'Delete Client', builder: results.builder, builder_jobs: results.builders_jobs });
    });

};

// Handle Builder delete on POST.
exports.builder_delete_post = function (req, res, next) {

    async.parallel({
        builder: function (callback) {
            Builder.findById(req.body.builderid).exec(callback)
        },
        builders_jobs: function (callback) {
            Job.find({ 'builder': req.body.builderid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success.
        if (results.builders_jobs.length > 0) {
            // Builder has jobs. Render in same way as for GET route.
            res.render('builder_delete', { title: 'Delete Builder', builder: results.builder, builder_jobs: results.builders_jobs });
            return;
        }
        else {
            // Builder has no jobs. Delete object and redirect to the list of builders.
            Builder.findByIdAndRemove(req.body.builderid, function deleteBuilder(err) {
                if (err) { return next(err); }
                // Success - go to builder list.
                res.redirect('/catalog/builders')
            })

        }
    });

};

// Display Builder update form on GET.
exports.builder_update_get = function (req, res, next) {

    Builder.findById(req.params.id, function (err, builder) {
        if (err) { return next(err); }
        if (builder == null) { // No results.
            var err = new Error('Builder not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('builder_form', { title: 'Update Builder', builder: builder });

    });
};

// Handle Builder update on POST.
exports.builder_update_post = [

    // Validate fields.
   

    // Sanitize fields.
    sanitizeBody('first_name').escape(),
    sanitizeBody('family_name').escape(),
  

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Builder object with escaped and trimmed data (and the old id!)
        var builder = new Builder(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                discription: req.body.discription,

                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('builder_form', { title: 'Update Builder', builder: builder, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Builder.findByIdAndUpdate(req.params.id, builder, {}, function (err, thebuilder) {
                if (err) { return next(err); }
                // Successful - redirect to region detail page.
                res.redirect(thebuilder.url);
            });
        }
    }
];
