$(document).ready(function(){
	$(".carousel").carousel();
})
function initMap() {
        var comicStore = {lat: 35.212614, lng:   -80.817919};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: comicStore,
          
        });
        var marker = new google.maps.Marker({
          position: comicStore,
          map: map
        });
      }




