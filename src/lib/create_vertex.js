const Constants = require('../constants');

/**
 * Returns GeoJSON for a Point representing the
 * vertex of another feature.
 *
 * @param {string} parentId
 * @param {Array<number>} coordinates
 * @param {string} path - Dot-separated numbers indicating exactly
 *   where the point exists within its parent feature's coordinates.
 * @param {boolean} selected
 * @return {GeoJSON} Point
 */
module.exports = function(parent, coordinates, path, selected) {
  const parentId = parent.properties && parent.properties.id;

  const properties = {
    meta: Constants.meta.VERTEX,
    parent: parentId,
    coord_path: path,
    active: (selected) ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE
  };

  Object.keys(parent.properties).forEach((key) => {
    if (key.indexOf('user_') === 0) {
      properties[key] = parent.properties[key];
    }
  });

  return {
    type: Constants.geojsonTypes.FEATURE,
    properties,
    geometry: {
      type: Constants.geojsonTypes.POINT,
      coordinates: coordinates
    }
  };
};
