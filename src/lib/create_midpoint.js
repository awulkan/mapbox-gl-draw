const Constants = require('../constants');

module.exports = function(parent, startVertex, endVertex, map) {
  const startCoord = startVertex.geometry.coordinates;
  const endCoord = endVertex.geometry.coordinates;

  // If a coordinate exceeds the projection, we can't calculate a midpoint,
  // so run away
  if (startCoord[1] > Constants.LAT_RENDERED_MAX ||
    startCoord[1] < Constants.LAT_RENDERED_MIN ||
    endCoord[1] > Constants.LAT_RENDERED_MAX ||
    endCoord[1] < Constants.LAT_RENDERED_MIN) {
    return null;
  }

  const ptA = map.project([ startCoord[0], startCoord[1] ]);
  const ptB = map.project([ endCoord[0], endCoord[1] ]);
  const mid = map.unproject([ (ptA.x + ptB.x) / 2, (ptA.y + ptB.y) / 2 ]);

  const properties = {
    meta: Constants.meta.MIDPOINT,
    parent: parent.properties.id,
    lng: mid.lng,
    lat: mid.lat,
    coord_path: endVertex.properties.coord_path
  };

  if (parent.properties) {
    Object.keys(parent.properties).forEach((key) => {
      if (key.indexOf('user_') === 0) {
        properties[key] = parent.properties[key];
      }
    });
  }

  return {
    type: Constants.geojsonTypes.FEATURE,
    properties,
    geometry: {
      type: Constants.geojsonTypes.POINT,
      coordinates: [mid.lng, mid.lat]
    }
  };
};
