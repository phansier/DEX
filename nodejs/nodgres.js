//var io = require('socket.io').listen(9000);

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

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
//var query = pg_client.query('SELECT * FROM bid_ask_last')
console.log('im here')
console.log(query)
query.then(function(result) {
   console.log(result.rows) //will log results.
})



//io.sockets.on('connection', function (socket) {
//    socket.emit('connected', { connected: true });
//
//    socket.on('ready for data', function (data) {
//        pg_client.on('notification', function(title) {
//            socket.emit('update', { message: title });
//        });
//    });
//});
