
GAMECODE = window.location.pathname.replace('/game/','').replace(/\?.*?$/,'');

if(GAMECODE == '') {
    window.location = '/';
    //thow new Error('invalid gamecode!')
}

var socket = io('http://localhost:8000/'+GAMECODE);

socket.on('connection_established', function (data) {
    console.log('connection_established',data);
    if( startgame == null )
    {
        setTimeout(function () {
            startgame();
        },200)
    }
    else {
        startgame();
    }
    socket.emit('player_join',players[player_uuid]);

});

socket.on('player_join', function (data) {
    console.log('player_join',data);

    players[data.uuid] = transformCharacter(data);
});

socket.on('player_leave', function (data) {
    console.log('player_leave',data);
    delete players[data];
});

socket.on('other_player_data', function (data) {
    console.log('other_player_data');
   for(var p in data){
       players[data[p].uuid] = transformCharacter(data[p]);
   }
});

socket.on('player_position', function (data) {
    if(! players[data.uuid])
        return;
    //console.log('player_position',data);
    players[data.uuid].x = data.x;
    players[data.uuid].y = data.y;
});

socket.on('disconnect',function () {
    console.log('someone disconnected');

});


function transformCharacter(data) {
    var c = new character(data.x,data.y,data.uuid)

    c.color = data.color;
    c.username = data.username;

    return c;

}