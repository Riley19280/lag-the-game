/**
 * Created by rschoppa on 2/28/18.
 */

class objective extends object {

    constructor(x,y) {
        super(x,y,30,80);
        this.solid = false;
        this.padding = 5;
        this.width = 30 + this.padding * 3;
        this.height = 80 + this.padding * 3;
        this.color = '#705a28'
    }

    draw(){
        super.drawBounds();
        ctx.strokeStyle = this.color;
        //bottom rects
        ctx.strokeRect(tx(this.x + this.padding                                      ), ty(this.y+this.padding), (this.width-this.padding * 3)/2, (-this.height + this.padding * 3)/2);
        ctx.strokeRect(tx(this.x + this.padding * 2 + (this.width-this.padding * 3)/2), ty(this.y+this.padding), (this.width-this.padding * 3)/2, (-this.height + this.padding * 3)/2);
        //top rects
        ctx.strokeRect(tx(this.x + this.padding                                      ), ty(this.y+this.padding + (this.height - this.padding * 1)/2), (this.width-this.padding * 3)/2, (-this.height + this.padding * 3)/2);
        ctx.strokeRect(tx(this.x + this.padding * 2 + (this.width-this.padding * 3)/2), ty(this.y+this.padding + (this.height - this.padding * 1)/2), (this.width-this.padding * 3)/2, (-this.height + this.padding * 3)/2);
        //handle
        ctx.beginPath();
        ctx.fillStyle = '#333333';
        ctx.arc(tx(this.x + this.width-7),ty(this.y + this.height/2),3,0,Math.PI*2)
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = null;

    }


    collideWith(obj1){
        if(obj1 instanceof character) {
            console.log('player has reached the objective');
            let found = false;
            for(let b in uielements){
                if (uielements[b] instanceof textbanner) {
                    found = true;
                }
            }
            if (!found)
                uielements.push(new textbanner(width/2,height/2,'OBJECTIVE REACHED!',60*7,60))

        }
    }

}