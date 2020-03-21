class character extends object {


    constructor(x, y, muuid) {
        super(x, y, 30, 80);

        this.isMine = player_uuid == muuid;
        this.uuid = muuid;
        //startgame
        this.speed = .3;
        this.velocity = {x: 0, y: 0};
        this.acceleration = {x: 0, y: 0};
        this.jumpAcceleration = 4.25;
        this.solid = true;
        
        this.grounded = true;
        this.recievesUpdates = player_uuid == muuid;

        //ismine initialization
        if(this.isMine){
            this.username = sessionStorage.username || 'Unknown';
            this.color = sessionStorage.color || '#000000'

        }

    }


    draw() {
        ctx.strokeStyle = this.color;
        //username
        ctx.font = "10px Comic Sans MS";
        ctx.textAlign = "center";
        ctx.fillText(this.username,tx(this.x+this.width/2),ty(this.y+this.height+4));

        //head
        ctx.beginPath();
        ctx.arc(tx(this.x + this.width / 2), ty(this.y + this.height - this.width / 2), this.width / 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        //body
        ctx.beginPath();
        ctx.moveTo(tx(this.x + this.width / 2), ty(this.y + this.height - this.width));
        ctx.lineTo(tx(this.x + this.width / 2), ty(this.y + this.height - this.width - this.width));
        //left leg
        ctx.moveTo(tx(this.x + this.width / 2), ty(this.y + this.height - this.width - this.width));
        ctx.lineTo(tx(this.x), ty(this.y));
        //right leg
        ctx.moveTo(tx(this.x + this.width / 2), ty(this.y + this.height - this.width - this.width));
        ctx.lineTo(tx(this.x + this.width), ty(this.y));
        if(this.grounded) {//moving arm position up if in the air
            //left arm
            ctx.moveTo(tx(this.x + this.width / 2), ty(this.y + this.height - this.width * 1.3));
            ctx.lineTo(tx(this.x), ty(this.y + this.height - this.width * 1.99));
            //right arm
            ctx.moveTo(tx(this.x + this.width / 2), ty(this.y + this.height - this.width * 1.3));
            ctx.lineTo(tx(this.x + this.width), ty(this.y + this.height - this.width * 1.99));
        }
        else {
            //left arm
            ctx.moveTo(tx(this.x + this.width / 2), ty(this.y + this.height - this.width * 1.3));
            ctx.lineTo(tx(this.x-10), ty(this.y + this.height - this.width * 1.0));
            //right arm
            ctx.moveTo(tx(this.x + this.width / 2), ty(this.y + this.height - this.width * 1.3));
            ctx.lineTo(tx(this.x + this.width+10), ty(this.y + this.height - this.width * 1.0));
        }
        ctx.closePath();
        ctx.stroke();
        //eyes
        ctx.beginPath();
        ctx.arc(tx(this.x + this.width / 3), ty(this.y + this.height - this.width / 2 + 2), 1, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(tx(this.x + this.width / 3 * 2), ty(this.y + this.height - this.width / 2 + 2), 1, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        //mouth
        ctx.beginPath();
        ctx.arc(tx(this.x + this.width / 2), ty(this.y + this.height - this.width / 2 - 6), 5, 0, Math.PI);
        ctx.closePath();
        ctx.stroke();
    }

    update() {
        if(!this.recievesUpdates)
            return;

        //handle movement input
        if (this.isMine) {
            if (Key.isDown(Key.UP)) this.moveUp();
            if (Key.isDown(Key.LEFT)) this.moveLeft();
            if (Key.isDown(Key.DOWN)) this.moveDown();
            if (Key.isDown(Key.RIGHT)) this.moveRight();
            if (Key.isDown(Key.SPACE)) this.moveJump();

            socket.emit('player_position',{uuid:player_uuid, x: this.x, y: this.y})
        }

        this._doPhysics()

    };

    _doPhysics() {
        //the physics
        //capping vel and acc
        let maxv = 5, maxa = 5;
        this.velocity.x > maxv ? this.velocity.x = maxv : {};
        this.velocity.x < -maxv ? this.velocity.x = -maxv : {};
        this.velocity.y > maxv && this.grounded ? this.velocity.y = maxv : {};
        this.velocity.y < -maxv ? this.velocity.y = -maxv : {};
        this.acceleration.x > maxa ? this.acceleration.x = maxa : {};
        this.acceleration.x < -maxa ? this.acceleration.x = -maxa : {};
        this.acceleration.y > maxa && this.grounded ? this.acceleration.y = maxa : {};
        this.acceleration.y < -maxa ? this.acceleration.y = -maxa : {};




        //adding friction
        let appliedFriction;
        if (this.grounded)
            appliedFriction = friction;
        else
            appliedFriction = air_friction;

        if (this.velocity.x > 0)
            if (this.velocity.x - appliedFriction < 0)
                this.velocity.x = 0
            else
                this.velocity.x -= appliedFriction;
        if (this.velocity.x < 0)
            if (this.velocity.x + appliedFriction > 0)
                this.velocity.x = 0;
            else
                this.velocity.x += appliedFriction;


        //gravity
        if (this.y > 0)
            this.acceleration.y -= gravity;

        //velocity updates
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        //position updates
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        //window position checks
        if (this.y < 0) {
            this.y = 0;
            this.stopy();
            this.grounded = true;
        }
        if (this.x < 0) {
            this.x = 0;
            this.stopx()
        }
        if (this.x > width - this.width) {
            this.x = width - this.width;
            this.velocity.x = 0;
            this.acceleration.x = 0;
        }

        //resetting acceleration
        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }

    collideWith(obj) {
        if (obj.solid) {

            let player_top = this.y + this.height;
            let obj_top = obj.y + obj.height;
            let player_right = this.x + this.width;
            let obj_right = obj.x + obj.width;

            let b_collision = obj_top - this.y;
            let t_collision = player_top - obj.y;
            let l_collision = player_right - obj.x;
            let r_collision = obj_right - this.x;

            if (t_collision < b_collision && t_collision < l_collision && t_collision < r_collision )
            {
                //bottom collision
                //console.log('bottom')
                this.stopy()
                this.y = obj.y - this.height
            }
            if (b_collision < t_collision && b_collision < l_collision && b_collision < r_collision)
            {
                //Top collision

                //console.log('top')
                this.grounded = true;
                this.stopy();
                this.y = obj.y + obj.height
            }
            if (l_collision < r_collision && l_collision < t_collision && l_collision < b_collision)
            {
                //Left collision
                //console.log('left')
                this.stopx()
                this.x = obj.x - this.width - 1;
            }
            if (r_collision < l_collision && r_collision < t_collision && r_collision < b_collision )
            {
                //Right collision
                //console.log('right')
                this.stopx()
                this.x = obj.x + obj.width + 1
            }

        }
    }

    stopx() {
        this.velocity.x = 0;
        this.acceleration.x = 0;
    }

    stopy() {
        this.velocity.y = 0;
        this.acceleration.y = 0;
    }

    moveLeft() {
        this.acceleration.x -= this.speed;
    }

    moveRight() {
        this.acceleration.x += this.speed;
    }

    moveUp() {
        //this.acceleration.y +=  this.speed;
    }

    moveDown() {
        this.acceleration.y -= this.speed;
    }

    moveJump() {
        if (this.grounded) {
            this.grounded = false;
            this.acceleration.y += this.jumpAcceleration;

        }
    }
}