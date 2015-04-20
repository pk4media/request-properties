'use strict';

var BPromise = require('bluebird');

module.exports = function(properties, options) {
  options = options || {};

  return function(req, res, next) {
    var property;

    try {
      for (property in properties) {
        if (req.hasOwnProperty(property)) {
          if (options.errorOnDuplicates) {
            throw new Error(property + ' already exists on req');
          }

          if (options.ignoreDuplicates) {
            continue;
          }
        }

        if (typeof properties[property] === 'function') {
          properties[property] = BPromise.resolve(properties[property](req));
        } else {
          properties[property] = BPromise.resolve(properties[property]);
        }
      }

      BPromise.props(properties)
        .then(function(properties) {
          for (property in properties) {
            req[property] = properties[property];
          }

          next();
        })
        .catch(function(error) {
          next(error);
        });
    } catch(ex) {
      next(ex);
    }
  };
};
