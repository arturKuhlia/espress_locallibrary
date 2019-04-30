var Job = require('../models/job');
var Builder = require('../models/builder');
var Region = require('../models/region');
var JobInstance = require('../models/jobinstance');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');



exports.contract = function(req, res) {

    async.parallel({
        job_count: function(callback) {
            Job.count(callback);
        },
        job_instance_count: function(callback) {
            JobInstance.count(callback);
        },
        job_instance_available_count: function(callback) {
            JobInstance.count({status:'Available'},callback);
        },
        builder_count: function(callback) {
            Builder.count(callback);
        },
        region_count: function(callback) {
            Region.count(callback);
        },
    }, function(err, results) {
        res.render('form/contract', { title: 'Local Library Home', error: err, data: results });
    });
};
 

exports.index = function(req, res) {

    async.parallel({
        job_count: function(callback) {
            Job.count(callback);
        },
        job_instance_count: function(callback) {
            JobInstance.count(callback);
        },
        job_instance_available_count: function(callback) {
            JobInstance.count({status:'Available'},callback);
        },
        builder_count: function(callback) {
            Builder.count(callback);
        },
        region_count: function(callback) {
            Region.count(callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};


// Display list of all jobs.
exports.job_list = function(req, res, next) {

    Job.find({}, 'title builder ')
      .populate('builder')
      .exec(function (err, list_jobs) {
        if (err) { return next(err); }
        // Successful, so render
        res.render('job_list', { title: 'Job List', job_list:  list_jobs});
      });
  
  };

// Display detail page for a specific job.
exports.job_detail = function(req, res, next) {

    async.parallel({
        job: function(callback) {

            Job.findById(req.params.id)
              .populate('builder')
              .populate('region')
              .exec(callback);
        },
        job_instance: function(callback) {

          JobInstance.find({ 'job': req.params.id })
          .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.job==null) { // No results.
            var err = new Error('Job not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('job_detail', { title: 'Title', job:  results.job,lat:  results.job.lat,lng:  results.job.lng, job_instances: results.job_instance } );
    });

};


// Display job exp form on GET.
exports.job_exp_get = function(req, res, next) {

    // Get all builders and regions, which we can use for adding to our job.
    async.parallel({
        builders: function(callback) {
            Builder.find(callback);
        },
        regions: function(callback) {
            Region.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('job_exp', { title: 'Create Job',builders:results.builders, regions:results.regions });
    });

};
// Display exp for a POST.

    
exports.job_exp_post = [
    // Convert the region to an array.
    (req, res, next) => {
        if(!(req.body.builder instanceof Array)){
            if(typeof req.body.builder==='undefined')
            req.body.region=[];
            else
            req.body.region=new Array(req.body.region);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    // body('builder', 'Builder must not be empty.').isLength({ min: 1 }).trim(),

    body('number', 'number must not be empty').isLength({ min: 1 }).trim(),
  
    // Sanitize fields.
    sanitizeBody('*').escape(),
    sanitizeBody('region.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Job object with escaped and trimmed data.
        var job = new Job(
          { title: req.body.title,
            builder: req.body.builder,
            number: req.body.number,
            dateOf: req.body.dateOf,
            jobLoc: req.body.jobLoc,
            // tenDate: [{
            //     date :req.body.date,
            //     discD :req.body.discD
            //   }],
            //   addArr: [{
            //     titleA :req.body.titleA,
            //     disc :req.body.disc
            //   }],
            region: req.body.region
           
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all builders and regions for form.
            async.parallel({
                builders: function(callback) {
                    Builder.find(callback);
                },
                regions: function(callback) {
                    Region.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected regions as checked.
                for (let i = 0; i < results.regions.length; i++) {
                    if (job.region.indexOf(results.regions[i]._id) > -1) {
                        results.regions[i].checked='true';
                    }
                }
                res.render('job_exp', { title: 'Create Job',builders:results.builders, regions:results.regions, job: job, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save job.
            job.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new job record.
                   res.redirect(job.url);
                });
        }
    }
];
 


// Display job create form on GET.
exports.job_create_get = function(req, res, next) {

    // Get all builders and regions, which we can use for adding to our job.
    async.parallel({
        builders: function(callback) {
            Builder.find(callback);
        },
        regions: function(callback) {
            Region.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('job_form', { title: 'Create Job',builders:results.builders, regions:results.regions });
    });

};

// Handle job create on POST.
exports.job_create_post = [
    // Convert the region to an array.
    (req, res, next) => {
        if(!(req.body.region instanceof Array)){
            if(typeof req.body.region==='undefined')
            req.body.region=[];
            else
            req.body.region=new Array(req.body.region);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
 
  
    // Sanitize fields.
    sanitizeBody('*').escape(),
    sanitizeBody('region.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Job object with escaped and trimmed data.
        var job = new Job(
          { title: req.body.title,
            builder: req.body.builder,
            summary: req.body.summary,
            number: req.body.number,
            region: req.body.region
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all builders and regions for form.
            async.parallel({
                builders: function(callback) {
                    Builder.find(callback);
                },
                regions: function(callback) {
                    Region.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected regions as checked.
                for (let i = 0; i < results.regions.length; i++) {
                    if (job.region.indexOf(results.regions[i]._id) > -1) {
                        results.regions[i].checked='true';
                    }
                }
                res.render('job_form', { title: 'Create Job',builders:results.builders, regions:results.regions, job: job, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save job.
            job.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new job record.
                   res.redirect(job.url);
                });
        }
    }
];



// Display job delete form on GET.
exports.job_delete_get = function(req, res, next) {

    async.parallel({
        job: function(callback) {
            Job.findById(req.params.id).populate('builder').populate('region').exec(callback);
        },
        job_jobinstances: function(callback) {
            JobInstance.find({ 'job': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.job==null) { // No results.
            res.redirect('/catalog/jobs');
        }
        // Successful, so render.
        res.render('job_delete', { title: 'Delete Job', job: results.job, job_instances: results.job_jobinstances } );
    });

};

// Handle job delete on POST.
exports.job_delete_post = function(req, res, next) {

    // Assume the post has valid id (ie no validation/sanitization).

    async.parallel({
        job: function(callback) {
            Job.findById(req.body.id).populate('builder').populate('region').exec(callback);
        },
        job_jobinstances: function(callback) {
            JobInstance.find({ 'job': req.body.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.job_jobinstances.length > 0) {
            // Job has job_instances. Render in same way as for GET route.
            res.render('job_delete', { title: 'Delete Job', job: results.job, job_instances: results.job_jobinstances } );
            return;
        }
        else {
            // Job has no JobInstance objects. Delete object and redirect to the list of jobs.
            Job.findByIdAndRemove(req.body.id, function deleteJob(err) {
                if (err) { return next(err); }
                // Success - got to jobs list.
                res.redirect('/catalog/jobs');
            });

        }
    });

};

// Display job update form on GET.
exports.job_update_get = function(req, res, next) {

    // Get job, builders and regions for form.
    async.parallel({
        job: function(callback) {
            Job.findById(req.params.id).populate('builder').populate('region').exec(callback);
        },
        builders: function(callback) {
            Builder.find(callback);
        },
        regions: function(callback) {
            Region.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.job==null) { // No results.
                var err = new Error('Job not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected regions as checked.
            for (var all_g_iter = 0; all_g_iter < results.regions.length; all_g_iter++) {
                for (var job_g_iter = 0; job_g_iter < results.job.region.length; job_g_iter++) {
                    if (results.regions[all_g_iter]._id.toString()==results.job.region[job_g_iter]._id.toString()) {
                        results.regions[all_g_iter].checked='true';
                    }
                }
            }
            res.render('job_form', { title: 'Update Job', builders:results.builders, regions:results.regions, job: results.job });
        });

};


// Handle job update on POST.
exports.job_update_post = [

    // Convert the region to an array.
    (req, res, next) => {
        if(!(req.body.region instanceof Array)){
            if(typeof req.body.region==='undefined')
            req.body.region=[];
            else
            req.body.region=new Array(req.body.region);
        }
        next();
    },
   
    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('builder', 'Builder must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('number', 'number must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('title').escape(),
    sanitizeBody('builder').escape(),
    sanitizeBody('summary').escape(),
    sanitizeBody('number').escape(),
    sanitizeBody('region.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Job object with escaped/trimmed data and old id.
        var job = new Job(
          { title: req.body.title,
            builder: req.body.builder,
            summary: req.body.summary,
            number: req.body.number,
            region: (typeof req.body.region==='undefined') ? [] : req.body.region,
            _id:req.params.id // This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all builders and regions for form
            async.parallel({
                builders: function(callback) {
                    Builder.find(callback);
                },
                regions: function(callback) {
                    Region.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected regions as checked.
                for (let i = 0; i < results.regions.length; i++) {
                    if (job.region.indexOf(results.regions[i]._id) > -1) {
                        results.regions[i].checked='true';
                    }
                }
                res.render('job_form', { title: 'Update Job',builders:results.builders, regions:results.regions, job: job, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Job.findByIdAndUpdate(req.params.id, job, {}, function (err,thejob) {
                if (err) { return next(err); }
                   // Successful - redirect to job detail page.
                   res.redirect(thejob.url);
                });
        }
    }
];

