var Addendum = require('../models/addendum')
var Job = require('../models/job')
var async = require('async')

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Addendums.
exports.addendum_list = function(req, res, next) {

  Addendum.find()
    .populate('job')
    .exec(function (err, list_ds) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('addendum_list', { title: 'Job Instance List', addendum_list:  list_addendums});
    })

};

// Display detail page for a specific Addendum.
exports.addendum_detail = function(req, res, next) {

    Addendum.findById(req.params.id)
    .populate('job')
    .exec(function (err, addendum) {
      if (err) { return next(err); }
      if (addendum==null) { // No results.
          var err = new Error('Job copy not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('addendum_detail', { title: 'Job:', addendum:  addendum});
    })

};

// Display Addendum create form on GET.
exports.addendum_create_get = function(req, res, next) {

     Job.find({},'title')
    .exec(function (err, jobs) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('addendum_form', {title: 'Create Addendum', job_list:jobs } );
    });

};

// Handle Addendum create on POST.
exports.addendum_create_post = [

    // Validate fields.
    body('job', 'Job must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
    // Sanitize fields.
    sanitizeBody('job').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').escape(),
    sanitizeBody('due_back').toDate(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Addendum object with escaped and trimmed data.
        var addendum = new Addendum(
          { job: req.body.job,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Job.find({},'title')
                .exec(function (err, jobs) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('addendum_form', { title: 'Create Addendum', job_list : jobs, selected_job : addendum.job._id , errors: errors.array(), addendum:addendum });
            });
            return;
        }
        else {
            // Data from form is valid
            addendum.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(addendum.url);
                });
        }
    }
];



// Display Addendum delete form on GET.
exports.addendum_delete_get = function(req, res, next) {

    Addendum.findById(req.params.id)
    .populate('job')
    .exec(function (err, addendum) {
        if (err) { return next(err); }
        if (addendum==null) { // No results.
            res.redirect('/catalog/addendums');
        }
        // Successful, so render.
        res.render('addendum_delete', { title: 'Delete Addendum', addendum:  addendum});
    })

};

// Handle Addendum delete on POST.
exports.addendum_delete_post = function(req, res, next) {
    
    // Assume valid Addendum id in field.
    Addendum.findByIdAndRemove(req.body.id, function deleteAddendum(err) {
        if (err) { return next(err); }
        // Success, so redirect to list of Addendum items.
        res.redirect('/catalog/addendums');
        });

};

// Display Addendum update form on GET.
exports.addendum_update_get = function(req, res, next) {

    // Get job, builders and regions for form.
    async.parallel({
        addendum: function(callback) {
            Addendum.findById(req.params.id).populate('job').exec(callback)
        },
        jobs: function(callback) {
            Job.find(callback)
        },

        }, function(err, results) {
            if (err) { return next(err); }
            if (results.addendum==null) { // No results.
                var err = new Error('Job copy not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('addendum_form', { title: 'Update  Addendum', job_list : results.jobs, selected_job : results.addendum.job._id, addendum:results.addendum });
        });

};

// Handle Addendum update on POST.
exports.addendum_update_post = [

    // Validate fields.
    body('job', 'Job must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
    // Sanitize fields.
    sanitizeBody('job').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').escape(),
    sanitizeBody('due_back').toDate(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Addendum object with escaped/trimmed data and current id.
        var addendum = new Addendum(
          { job: req.body.job,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
            _id: req.params.id
           });

        if (!errors.isEmpty()) {
            // There are errors so render the form again, passing sanitized values and errors.
            Job.find({},'title')
                .exec(function (err, jobs) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('addendum_form', { title: 'Update Addendum', job_list : jobs, selected_job : addendum.job._id , errors: errors.array(), addendum:addendum });
            });
            return;
        }
        else {
            // Data from form is valid.
            Addendum.findByIdAndUpdate(req.params.id, addendum, {}, function (err,theaddendum) {
                if (err) { return next(err); }
                   // Successful - redirect to detail page.
                   res.redirect(theaddendum.url);
                });
        }
    }
];
