/**
 * Created by rschoppa on 2/14/18.
 */

function startgame() {
    window.cancelAnimationFrame(lastframe);
    document.querySelector('#gamewindow').focus();


    players = {};
    objects = [];
    players[player_uuid] = new character(width / 2, 0,player_uuid);

	objects.push(new box(50,50,50,50));
    objects.push(new box(150,0,50,50));
    objects.push(new box(300,100,50,50));
    objects.push(new objective(500,0));

    lastframe = requestAnimationFrame(gameloop);
}



function tx(x) {
	return x;
}
function ty(y) {
	return height - y;
}

let lastframe;
let canvas = document.getElementById("gamewindow");
let ctx = canvas.getContext('2d');
let width = 1366;//TODO:Dynamically set this
let height = 768;//TODO:Dynamically set this
let gravity = .1;
let friction = .2;
let air_friction = .1;
let player_uuid = Math.random().toString(36).substring(7);

canvas.width = width;
canvas.height = height;

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

let players = [];
let objects = [];
let uielements = [];

function gameloop() {
    ctx.clearRect(0, 0, width, height);

    for (var p in players) {
		players[p].update();

		//players[p].drawBounds()
        for(let q in players){
            if(players[p].isColliding(players[q])){
                players[p].collideWith(players[q]);
                players[q].collideWith(players[p]);
            }
        }

        players[p].draw();

    }



	for (var o in objects) {
    	//checking player collisions
		for(let p in players){
		    if(!players[p].recievesUpdates)
		        break;
			if(objects[o].isColliding(players[p])){
				objects[o].collideWith(players[p])
				players[p].collideWith(objects[o])
			}
		}
    	//o updates
		objects[o].update();
		objects[o].draw();
    }

    for(var e in uielements) {
        uielements[e].update();
        if(uielements[e])
            uielements[e].draw();
    }

    lastframe = window.requestAnimationFrame(gameloop);
}


var Key = {
    _pressed: {},

    LEFT: 65,
    UP: 87,
    RIGHT: 68,
    DOWN: 83,
    SPACE: 32,

    isDown: function(keyCode) {
        return this._pressed[keyCode];
    },

    onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup: function(event) {
        delete this._pressed[event.keyCode];
    }
};
