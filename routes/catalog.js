var express = require('express');
var router = express.Router();


// Require our controllers.
var job_controller = require('../controllers/jobController'); 
var builder_controller = require('../controllers/builderController');
var region_controller = require('../controllers/regionController');
var job_instance_controller = require('../controllers/jobinstanceController');


/// job ROUTES ///

// GET catalog home page.
router.get('/', job_controller.index);  

router.get('/job/contract', job_controller.contract);  

// GET request for EXPeriment.
router.get('/job/exp', job_controller.job_exp_get);


// GET request for EXPeriment.
router.get('/job/exp', job_controller.job_exp_get);

// POST request for creating Job.
router.post('/job/exp', job_controller.job_exp_post);



// GET request for creating a Job. NOTE This must come before routes that display Job (uses id).
router.get('/job/create', job_controller.job_create_get);

// POST request for creating Job.
router.post('/job/create', job_controller.job_create_post);

// GET request to delete Job.
router.get('/job/:id/delete', job_controller.job_delete_get);

// POST request to delete Job.
router.post('/job/:id/delete', job_controller.job_delete_post);

// GET request to update Job.
router.get('/job/:id/update', job_controller.job_update_get);

// POST request to update Job.
router.post('/job/:id/update', job_controller.job_update_post);

// GET request for one Job.
router.get('/job/:id', job_controller.job_detail);

// GET request for list of all Job.
router.get('/jobs', job_controller.job_list);

/// builder ROUTES ///

// GET request for creating Builder. NOTE This must come before route for id (i.e. display builder).
router.get('/builder/create', builder_controller.builder_create_get);

// POST request for creating Builder.
router.post('/builder/create', builder_controller.builder_create_post);

// GET request to delete Builder.
router.get('/builder/:id/delete', builder_controller.builder_delete_get);

// POST request to delete Builder
router.post('/builder/:id/delete', builder_controller.builder_delete_post);

// GET request to update Builder.
router.get('/builder/:id/update', builder_controller.builder_update_get);

// POST request to update Builder.
router.post('/builder/:id/update', builder_controller.builder_update_post);

// GET request for one Builder.
router.get('/builder/:id', builder_controller.builder_detail);

// GET request for list of all Builders.
router.get('/builders', builder_controller.builder_list);


/// region ROUTES ///

// GET request for creating a Region. NOTE This must come before route that displays Region (uses id).
router.get('/region/create', region_controller.region_create_get);

// POST request for creating Region.
router.post('/region/create', region_controller.region_create_post);

// GET request to delete Region.
router.get('/region/:id/delete', region_controller.region_delete_get);

// POST request to delete Region.
router.post('/region/:id/delete', region_controller.region_delete_post);

// GET request to update Region.
router.get('/region/:id/update', region_controller.region_update_get);

// POST request to update Region.
router.post('/region/:id/update', region_controller.region_update_post);

// GET request for one Region.
router.get('/region/:id', region_controller.region_detail);

// GET request for list of all Region.
router.get('/regions', region_controller.region_list);


/// jobINSTANCE ROUTES ///

// GET request for creating a JobInstance. NOTE This must come before route that displays JobInstance (uses id).
router.get('/jobinstance/create', job_instance_controller.jobinstance_create_get);

// POST request for creating JobInstance.
router.post('/jobinstance/create', job_instance_controller.jobinstance_create_post);

// GET request to delete JobInstance.
router.get('/jobinstance/:id/delete', job_instance_controller.jobinstance_delete_get);

// POST request to delete JobInstance.
router.post('/jobinstance/:id/delete', job_instance_controller.jobinstance_delete_post);

// GET request to update JobInstance.
router.get('/jobinstance/:id/update', job_instance_controller.jobinstance_update_get);

// POST request to update JobInstance.
router.post('/jobinstance/:id/update', job_instance_controller.jobinstance_update_post);

// GET request for one JobInstance.
router.get('/jobinstance/:id', job_instance_controller.jobinstance_detail);

// GET request for list of all JobInstance.
router.get('/jobinstances', job_instance_controller.jobinstance_list);







module.exports = router;
