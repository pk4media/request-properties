var BPromise = require('bluebird');
var express = require('express');
var request = require('supertest');
var assert = require('assert');
var properties = require('../index');

describe('request-properties', function() {
  it('should load values and functions', function(done) {
    var app = express();

    app.use(properties({
      foo: function(req) {
        return 'bar';
      },
      bar: 'baz',
      numberProperty: 1234
    }));

    app.use(function(req, res) {
      req.foo.should.equal('bar');
      req.bar.should.equal('baz');
      req.numberProperty.should.equal(1234);
      res.end();
    });

    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        done(err);
      });
  });

  it('should resolve promises', function(done) {
    var app = express();

    app.use(properties({
      foo: function(req) {
        return BPromise.resolve('1234');
      },
      bar: BPromise.resolve(5678)
    }));

    app.use(function(req, res) {
      req.foo.should.equal('1234');
      req.bar.should.equal(5678);
      res.end();
    });

    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        done(err);
      });
  });

  it('should resolve a mixture of promises and values', function(done) {
    var app = express();

    app.use(properties({
      foo: function(req) {
        return BPromise.resolve({value: 5678});
      },
      bar: 'abcd'
    }));

    app.use(function(req, res) {
      req.foo.value.should.equal(5678);
      req.bar.should.equal('abcd');
      res.end();
    });

    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        done(err);
      });
  });

  it('should throw on duplicates with errorOnDuplicates set to true', function(done) {
    var app = express();

    app.use(properties({
      baseUrl: 'override an existing property'
    }, {
      errorOnDuplicates: true
    }));

    app.use(function(err, req, res, next) {
      res.status(500);
      res.end();
    });

    request(app)
      .get('/')
      .expect(500)
      .end(function(err, res) {
        done(err);
      });
  });

  it('should not throw without duplicates and errorDuplicates set to true', function(done) {
    var app = express();

    app.use(properties({
      foo: 'override an existing property'
    }, {
      errorOnDuplicates: true
    }));

    app.use(function(req, res) {
      req.foo.should.equal('override an existing property');
      res.end();
    });

    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        done(err);
      });
  });
});
