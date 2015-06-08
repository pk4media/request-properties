'use strict';

var BPromise = require('bluebird');

module.exports = function(properties, options) {
  options = options || {};

  return function(req, res, next) {
    try {
      var property;
      for (property in properties) {
        (function(property) {
          if (req.hasOwnProperty(property)) {
            if (options.errorOnDuplicates) {
              throw new Error(property + ' already exists on req');
            }

            if (options.ignoreDuplicates) {
              return;
            }
          }

          if (typeof properties[property] === 'function') {
            properties[property] = BPromise.resolve(properties[property](req));
          } else {
            properties[property] = BPromise.resolve(properties[property]);
          }
        })(property);
      }

      BPromise.props(properties)
        .then(function(properties) {
          var requestProperties;
          for (requestProperties in properties) {
            (function(requestProperties) {
              req[requestProperties] = properties[requestProperties];
            })(requestProperties);
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
