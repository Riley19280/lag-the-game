/**
 * Created by rschoppa on 2/28/18.
 */

class textbanner extends uielement {

    constructor(x,y,text,duration, fadeduration) {
        super(x,y);
        this.text = text;
        this.duration = duration;
        this.fadeduration = fadeduration;
        this.current = 0;
        this.currentOpacity = 0;
    }

    update(){

        if(this.current >= this.duration) {
            this.currentOpacity = 0;
            uielements.splice(uielements.indexOf(this),1);
        }
        else if(this.current < this.fadeduration) {//fade in
            this.currentOpacity += (1/this.fadeduration)
        }
        else if (this.current > this.fadeduration && this.current < this.duration - this.fadeduration) {// middle
            this.currentOpacity = 1;
        }
        else if (this.current > this.duration - this.fadeduration){//fade out
            this.currentOpacity -= (1/this.fadeduration)
        }

        this.current++;
    }


    draw(){
        ctx.strokeStyle = '#333333';
        ctx.fillStyle = '#333333'
        ctx.font = "100px Comic Sans MS";
        //ctx.textAlign = 'center';
      //  ctx.fillOpacity = this.currentOpacity;
        ctx.fillText(this.text,tx(width/2),ty(height/2),1)
      //  ctx.fillRect(tx(width/2),ty(height/2),200,200)
    }

}