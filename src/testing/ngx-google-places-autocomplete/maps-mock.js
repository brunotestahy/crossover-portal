var google = window.google || {};
google.maps = google.maps || {};
google.maps.places = google.maps.places || {};

// Maps
google.maps.OverlayView = function () { };
google.maps.Marker = function () { };
google.maps.InfoWindow = function () { };
google.maps.LatLng = function (lat, lng) {
  return [lat, lng];
};
google.maps.Map = function (obj) { };
google.maps.MapTypeId = {ROADMAP: true};

// Maps places
google.maps.places.Autocomplete = function () {
  return {
    addListener: function () { }
  };
};
google.maps.places.AutocompleteService = function () { };
google.maps.places.PlacesService = function (obj) {
  return {
    PlacesServiceStatus: { OK: true },
    textSearch: function(query){
      return [];
    },
    nearbySearch: function(query){
      return [];
    }
  };
};
