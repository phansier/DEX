var pg = require ('pg');
var con_string = 'tcp://quikuser:JbT061409@0.0.0.0:5432/quik';
var pg_client = new pg.Client(con_string);
var pgConString = 'tcp://quikuser:JbT061409@0.0.0.0:5432/quik';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

//var rows_cols = client.query("SELECT id FROM ri_options");
//rows_cols.then(function(result) {
//   console.log(result.rows) //will log results.
//})
//console.log(rows_cols);
//io.emit('fixa',rows_cols);

pg_client.connect(function(err, client) {
  if(err) {
    console.log(err);
  }
  client.on('notification', function(msg) {
    //console.log(msg);
   io.emit('fixa',msg);
  });
  var query = client.query("LISTEN watchers");
  var rows_cols = client.query("SELECT id FROM ri_options");
  rows_cols.then(function(result) {
   console.log(result.rows) //will log results.
});
//console.log(rows_cols);
//io.emit('rc',rows_cols);
});
//var rows_cols = client.query("SELECT id FROM ri_options");
//console.log(rows_cols);
//io.emit('rc',rows_cols);


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
   console.log('user disconnected');
  });
});


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index2.html');
});
http.listen(port, function(){
  console.log('listening on *:' + port);
});

var pg = require ('pg');

var con_string = 'tcp://quikuser:JbT061409@0.0.0.0:5432/quik';

var pg_client = new pg.Client(con_string);
pg_client.connect();
var query = pg_client.query('LISTEN addedrecord');
var query = pg_client.query('SELECT id FROM ri_options')
//console.log('im here')
//console.log(query)
query.then(function(result) {
   console.log(result.rows) //will log results.
})
