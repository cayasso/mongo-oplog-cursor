# mongo-oplog-cursor

[![NPM version](https://badge.fury.io/js/mongo-oplog-cursor.svg)](http://badge.fury.io/js/mongo-oplog-cursor)

Create mongo oplog cursors.

## Installation

``` bash
$ npm install mongo-oplog-cursor
```

## Usage

``` javascript
var MongoClient = require('mongodb').MongoClient;
var MongoCursor = require('mongo-oplog-cursor');

MongoClient.connect(function(err, db) {
  
  var ts = Date.now()/1000 | 0;

  var mongoCursor = MongoCursor({
    db: db,
    ns: 'posts',
    ts: ts
  });

  mongoCursor.cursor(function getCursor(err, cursor) {
    
    // Get cursor stream.
    var stream = cursor.stream();

    stream.on('end', function () {
      console.log('stream ended');
    });

    stream.on('data', function (data) {
      console.log(data);
    });

    stream.on('error', function (err) {
      console.log(err);
    });
  });

  // Or for short cut

  var mongoCursor = MongoCursor({ db: db }, function getCursor(err, cursor) {
    
    // Get cursor stream.
    var stream = cursor.stream();

    stream.on('end', function () {
      console.log('stream ended');
    });

    stream.on('data', function (data) {
      console.log(data);
    });

    stream.on('error', function (err) {
      console.log(err);
    });
  });

});
```

## API

### MongoCursor(options, [fn])

Set cursor object, if callback is passed then it will create and return an oplog cursor.

Options:

  * `db`: Required valid Mongo Db instance.
  * `ns`: Optional namespace for start tailing on eg.(`test.posts`, `*.posts`, `test.*`), defaults to `*`.
  * `ts`: Optional UTC timestamp in miliseconds for oplog cursor query.
  * `coll`: Optional oplog collection name, defaults to `oplog.rs`.

### mongoCursor.cursor(fn)

Create oplog cursor.

```javascript
mongoCursor.cursor(function(err, cursor){
  var stream = cursor.stream();
})
```

## Run tests

Configure MongoDB for ac active oplog:

Start MongoDB with:

``` bash
$ mongod --replSet test
```

Start a `mongo` shell and configure mongo as follows:

```bash
> var config = {_id: "test", members: [{_id: 0, host: "127.0.0.1:27017"}]}
> rs.initiate(config)
```

Once configuration is initiated then you can run the test:

``` bash
$ npm install
$ make test
```

## License

(The MIT License)

Copyright (c) 2015 Jonathan Brumley &lt;cayasso@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
