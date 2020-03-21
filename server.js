var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8000);

function handler (req, res) {
    //console.log(req.url)
    if(req.url === '/'){
        res.writeHead(200);
        getFile('/public/index.html',(data)=>res.end(data))
    }
    else if (req.url === '/favicon.ico'){
        res.writeHead(404);
        res.end('none');
    }
    else if (req.url.indexOf('/game/')!== -1 && req.url.indexOf('.') === -1) {
        let code = req.url.replace('/game/','').replace(/\?.*?$/,'');
        gameRequested(code);
        res.writeHead(200);
        getFile('/public/game.html',(data)=>res.end(data))
    }
    else if (req.url.indexOf('/api/games')!== -1) {
        var out = [];
        for (let g in running_games) {
            out.push({code: g, players: Object.keys(running_games[g].players).length})
        }
        res.end(JSON.stringify(out));
    }
    else {
        getFile('/public'+req.url,(data)=>res.end(data))
    }
}


function getFile(path,fn) {
    fs.readFile(__dirname + path,
        function (err, data) {

            if (err) {
                console.log(err);
                fn(null);
            }

          fn(data);
        });
}

let running_games = {};

function gameRequested(code) {

    if(!running_games[code])
    {
        console.log('creating game '+code);
        running_games[code] = { players: {},socketresolve:{}, started_at: new Date()};
        running_games[code].socket = io.of('/'+code);
        registerHandlersForNewGame(code,running_games[code]);
    }
    else {

    }

}

function registerHandlersForNewGame(code, game) {
   game.socket.on('connection', function(socket){
        socket.emit('connection_established');


       socket.on('disconnect', function(data){
           //console.log('someone disconnected: '+socket.id);

           let playeruuid = game.socketresolve[socket.id.replace(/^.*?#/,'')];

           delete game.players[playeruuid];
           socket.broadcast.emit('player_leave',playeruuid)


           if(Object.keys(game.players).length === 0) {
               setTimeout(function(){
                   const MyNamespace = io.of('/'+code); // Get Namespace
                   const connectedNameSpaceSockets = Object.keys(MyNamespace.connected); // Get Object with Connected SocketIds as properties
                   connectedNameSpaceSockets.forEach(socketId => {
                       MyNamespace.connected[socketId].disconnect(); // Disconnect Each socket
                   });
                   MyNamespace.removeAllListeners(); // Remove all Listeners for the event emitter
                   delete io.nsps['/'+code]; // Remove from the server namespaces
                   delete running_games[code]
               }, 20*60);

           }
       });

       socket.on('player_join', function (data) {
           console.log('player_join',socket.id);

           game.socketresolve[socket.id.replace(/^.*?#/,'')] = data.uuid;

           //sending the player that just joined the every other player in the room
            socket.emit('other_player_data',game.players);

           game.players[data.uuid] = data;

           //sending the player that joined to all other players in the room
           socket.broadcast.emit('player_join',data);


       });

       socket.on('player_leave', function (data) {
           console.log('player_leave');

           let playeruuid = game.socketresolve[socket.id.replace(/^.*?#/,'')];

           delete game.players[data];
           socket.broadcast.emit('player_leave',playeruuid)
       });

       socket.on('player_position', function (data) {
           socket.broadcast.emit('player_position',data);
       });


    });

}