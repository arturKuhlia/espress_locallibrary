var Job = require('../controllers/jobController');
function jobFind() {

      
  }

function initMap() {
      // The location of Uluru
      var uluru = {lat: job.lat, lng: job.lng};
      // The map, centered at Uluru
      Job.findById(req.params.id)
        .populate('lng')
        .populate('lat')
      
      var map = new google.maps.Map(

            
      document.getElementById('map'), {zoom: 4, center: uluru});
      // The marker, positioned at Uluru
      var marker = new google.maps.Marker({position: uluru, map: map});
      }