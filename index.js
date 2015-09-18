'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('mongo-oplog-cursor');
var Timestamp = require('bson-timestamp');

/**
 * Core object inherited from emitter.
 * 
 * @type {Object}
 * @api public
 */

var cursor = Object.create(null);

/**
 * Create a cursor object.
 * 
 * @param {Object} options
 * @return {Cursor}
 * @api public
 */

cursor.create = function create(options) {
  return Object.create(this).init(options);
};

/**
 * Initialize cursor object.
 *
 * @param {Object} options
 * @return {Cursor} this
 * @api private
 */

cursor.init = function init(options) {
  options = options || {};
  this.db = options.db;
  this.ns = options.ns;
  this.ts = options.ts;
  this.cn = options.coll || 'oplog.rs';
  if (!this.db) throw new Error('Mongo db is missing.');
  this.coll = this.db.collection(this.cn);
  return this;
};

/**
 * Get cursor.
 *
 * @param {Function} fn
 * @api public
 */

cursor.cursor = function get(fn) {
  var query = {};
  var ns = this.ns;
  var coll = this.coll;
  if (ns) query.ns = { $regex: regex(ns) };
  this.timestamp(function timestamp(err, ts) {
    if (err) return fn(err);
    query.ts = { $gt: ts };
    fn(null, coll.find(query, {
      tailable: true,
      timeout: false,
      awaitdata: true,
      oplogReplay: true,
      cursorReplay: true,
      numberOfRetries: Number.MAX_VALUE
    }));
  });
  return this;
};

/**
 * Get cursor query timestamp.
 *
 * @param {Function} fn
 * @api private
 */

cursor.timestamp = function timestamp(fn) {
  var ts = this.ts;
  var coll = this.coll;
  if (ts) return fn(null, 'number' !== typeof ts ? ts : Timestamp(0, ts));
  coll
    .find({}, { ts: 1 })
    .sort({ $natural: -1 })
    .limit(1)
    .nextObject(function nextObject(err, doc) {
      if (err) return fn(err);
      if (doc) ts = doc.ts;
      else ts = Timestamp(0, (Date.now()/1000 | 0));
      fn(null, ts);
    });
};

/**
 * Namespace regex builder.
 *
 * @param {String} pattern
 * @return {RegExp} regular expresion
 * @api private
 */

function regex(pattern) {
  pattern = pattern || '*';
  pattern = pattern.replace(/[\*]/g, '(.*?)');
  return new RegExp('^' + pattern, 'i');
};

/**
 * Create cursor object.
 *
 * @param {Object} options
 * @param {Function} [fn]
 * @return {Cursor}
 * @api public
 */

module.exports = function factory(options, fn) {
  var cur = cursor.create(options);
  if (fn) return cur.cursor(fn);
  return cur;
};
