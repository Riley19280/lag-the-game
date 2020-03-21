
class object {

	constructor(x,y,width,height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.solid = false;
		this.color = '#000000'
	}

	draw(){
		this.drawBounds();
	}

	update(){}

	drawBounds() {
		ctx.strokeStyle = this.color;
		ctx.strokeRect(tx(this.x), ty(this.y), this.width, -this.height)
	}

	/*static isColliding(obj1, obj2){
		if(obj1.x <= obj2.x+obj2.width && obj1.x+obj1.width >= obj2.x && obj1.y<= obj2.y+obj2.height && obj1.y+obj1.height >= obj2.y ){
			return true;
		}
		return false;
	}*/

	isColliding(obj1){
		let obj2 = this
		if(obj1.x <= obj2.x+obj2.width && obj1.x+obj1.width >= obj2.x && obj1.y<= obj2.y+obj2.height && obj1.y+obj1.height >= obj2.y ){
			return true;
		}
		return false;
	}

	collideWith(){}

}