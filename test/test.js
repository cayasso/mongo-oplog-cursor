'use strict';

/**
 * Module dependencies.
 */

var should = require('should');
var Stream = require('stream');
var MongoClient = require('mongodb').MongoClient;
var MongoOplogCursor = require('../');
var db;
var conn = {
  oplog: 'mongodb://127.0.0.1:27017/local'
};

describe('mongo-oplog', function () {

  before(function (done) {
    MongoClient.connect(conn.oplog, function (err, database) {
      if (err) return done(err);
      db = database;
      done();
    });
  });

  it('should be a function', function () {
    MongoOplogCursor.should.be.a.Function;
  });

  it('should have required methods', function (done) {
    var cursor = MongoOplogCursor({ db: db });
    cursor.cursor.should.be.a.Function;
    done();
  });

  it('should get oplog cursor', function (done) {
    MongoOplogCursor({ db: db })
      .cursor(function (err, cursor) {
        if (err) return done(err);
        cursor.stream().should.be.instanceof(Stream);
        done();
      });
  });

  it('should get oplog cursor from constructor', function (done) {
    MongoOplogCursor({ db: db }, function (err, cursor) {
      if (err) return done(err);
      cursor.stream().should.be.instanceof(Stream);
      done();
    });
  });

  after(function (done) {
    db.close(done);
  });

});
