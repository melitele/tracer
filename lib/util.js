const LatLon = require('geodesy/latlon-spherical');

// Earth radius according to Google Maps API docs
// https://developers.google.com/maps/documentation/javascript/reference/geometry#spherical
const earthRadius = 6378137;

/**
 * Calculate distance between 2 points in meters
 * @param {Array} p1 First point as [longitude, latitude]
 * @param {Array} p2 Second point as [longitude, latitude]
 * @returns {Number} Distance in meters
 */
function distance(p1, p2) {
  p1 = new LatLon(p1[1], p1[0]);
  p2 = new LatLon(p2[1], p2[0]);
  return p1.distanceTo(p2, earthRadius);
}

/**
 * Compare 2 points
 * @param {Array} p1 First point as [longitude, latitude]
 * @param {Array} p2 Second point as [longitude, latitude]
 * @returns {Boolean} True if points are equal
 */
function equals(p1, p2) {
  return p1[0] === p2[0] && p1[1] === p2[1];
}

module.exports = {
  distance,
  equals
};
