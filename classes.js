var cam = {
		"x":0,
		"y":0,
		"vx":0,
		"vy":0,
		"ax":0,
		"ay":0,
		"limit":3,
		"mass":15,
		"moveX":0,
		"vSlow":0.8,
		"moveY":0,
		"behave":function() {
			this.vx -= this.x / this.mass;
			this.vy -= this.y / this.mass;
			this.vx *= this.vSlow;
			this.vy *= this.vSlow;
			//this.x += (Math.random() - 0.5) * this.vx * 2;
			//this.y += (Math.random() - 0.5) * this.vy * 2;
			this.x += this.vx;
			this.y += this.vy;
			if (Math.abs(this.x) > this.limit) this.x = this.x / Math.abs(this.x) * this.limit;
			if (Math.abs(this.y) > this.limit) this.y = this.y / Math.abs(this.y) * this.limit;
			if (Math.abs(this.x) < 1) this.x = 0;
			if (Math.abs(this.y) < 1) this.y = 0;
		}
	}
class Eff {
	constructor() {
		this.ar = [];
		this.arm = 0;
		this.k = 0;
		this.temp = 0;
		this.lifeSpan = 0;
		this.maxLife = 0;
	}
	remove(index) {
		this.temp = this.ar[index];
		this.ar[index] = this.ar[this.arm - 1];
		this.ar[this.arm - 1] = this.temp;
		this.arm --;
	}
}
class PlayerTrail extends Eff {
	constructor() {
		super();
		this.maxLife = 120;
	}
	spawn() {
		if (this.ar[this.arm] == null) {
			this.ar[this.arm] = {
				"x":p.x,
				"y":p.y,
				"vx":-Math.cos(p.angle) * p.speed / 10,
				"vy":-Math.sin(p.angle) * p.speed / 10,
				"w":p.w/ 2 + Math.random() * 4,
				"lifeSpan":0,
				"maxLife":15,
				"sides":5,
				"fill":rgb(125 + Math.floor(Math.random() * 125),200 + Math.floor(Math.random() * 55),25,0.3),
				"stroke":"rgba(255,255,255,1)",
				"render":function() {
					ctx.save();
					ctx.beginPath();
					ctx.fillStyle = this.fill;
					ctx.strokeStyle = this.stroke;
					ctx.translate(this.x, this.y);
					ctx.rotate(this.angle);
					for (var i = 0 ; i <= this.sides ; i ++) {
						ctx.lineTo(Math.cos(i / this.sides * 2 * Math.PI) * this.w, Math.sin(i / this.sides * 2 * Math.PI) * this.w);
					}
					ctx.fill();
					ctx.stroke();
					ctx.restore();
				},
				"update":function() {
					this.vx += (Math.random() - 0.5);
					this.vy += (Math.random() - 0.5);
					this.x += this.vx;
					this.y += this.vy;
					this.w -= 0.3;
				}
			}
		} else {
			this.ar[this.arm].x = p.x;
			this.ar[this.arm].y = p.y;
			this.ar[this.arm].w = p.w/ 2 + Math.random() * 4;
			this.ar[this.arm].vx = -Math.cos(p.angle) * p.speed / 10;
			this.ar[this.arm].vy = -Math.sin(p.angle) * p.speed / 10;
			this.ar[this.arm].lifeSpan = 0;
			this.ar[this.arm].fill = rgb(125 + Math.floor(Math.random() * 125),200 + Math.floor(Math.random() * 55),25,0.3);
		}
		this.arm ++;
	}
	render() {
		for (this.k = 0 ; this.k < this.arm ; this.k ++) {
			this.ar[this.k].render();
		}
	}
	update() {
		for (this.k = 0 ; this.k < this.arm ; this.k ++) {
			this.ar[this.k].update();
			this.ar[this.k].lifeSpan ++;
			if (this.ar[this.k].lifeSpan > this.ar[this.k].maxLife) {
				this.remove(this.k);
			}
		}
	}
}
class Shard {
	constructor(x, y, w, angle, speed, ang) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.angle = angle;
		this.turn = (Math.random() - 0.5) * 0.5;
		this.vx = Math.cos(ang) * speed;
		this.vy = Math.sin(ang) * speed;
		this.fill = "rgba(255,200,25,0.5)";
		this.stroke = "rgba(255,200,255,0.9)";
		this.lifeSpan = 0;
		this.maxLife = 1;
		this.decay = Math.random() * 0.5 + 0.5;
	}
	render() {
		ctx.strokeStyle = this.stroke;
		ctx.fillStyle = this.fill;
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.beginPath();
		ctx.moveTo(this.w,0);
		ctx.lineTo(0,this.w / 2);
		ctx.lineTo(-this.w, 0);
		ctx.lineTo(0,-this.w / 2);
		ctx.lineTo(this.w, 0);
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}
	update() {
		this.angle += this.turn;
		this.w -= this.decay;
		if (this.w <= 0) this.lifeSpan = this.maxLife;
		this.x += this.vx;
		this.y += this.vy;
	}
}
class Polygon {
	constructor(x, y, w, angle, speed, ang) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.angle = angle;
		this.turn = (Math.random() - 0.5) * 0.5;
		this.vx = Math.cos(ang) * speed;
		this.vy = Math.sin(ang) * speed;
		this.fill = "rgba(255,200,25,0.5)";
		this.stroke = "rgba(255,200,255,0.9)";
		this.lifeSpan = 0;
		this.maxLife = 1;
		this.decay = Math.random() + 0.1;
		this.sides = Math.ceil(this.w / 10);
	}
	render() {
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = this.stroke;
		ctx.fillStyle = this.fill;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		for (var i = 0 ; i <= this.sides ; i ++) {
			ctx.lineTo(Math.cos(i / this.sides * 2 * Math.PI) * this.w, Math.sin(i / this.sides * 2 * Math.PI) * this.w);
		}
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}
	update() {
		if (frames % 6 == 0) eff[eff.length] = new Shard(this.x, this.y, this.w * Math.random(), randomAngle(), Math.random(), randomAngle());
		this.angle += this.turn;
		this.w -= this.decay;
		if (this.w <= 0) this.lifeSpan = this.maxLife;
		this.x += this.vx;
		this.y += this.vy;
	}
}
class Rect {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	render() {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x - this.w, this.y - this.h, this.w * 2, this.h * 2);
	}
}
class Mob {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.ax = 0;
		this.ay = 0;
		this.HP = 0;
		this.dead = true;
		this.hitCD = 15;
		this.doomHP = 0;
	}
	render() {
	}
	update() {

	}
	hurt() {

	}
	death() {

	}
}
class Proj {
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.dead = false;
	}
	render() {

	}
	update() {

	}
	death() {

	}
}
class Torp extends Proj {
	constructor(x, y, w, speed, angle) {
		super(x, y, w);
		this.speed = speed;
		this.angle = angle;
		this.ang = 0;
		this.turn = 0.5;
		this.sides = 3;
	}
	render() {
		this.ang += this.turn;
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.ang);
		ctx.fillStyle = this.fill;
		ctx.strokeStyle = this.stroke;
		ctx.beginPath();
		for (var i = 0 ; i <= this.sides ; i ++) {
			ctx.lineTo(Math.cos(i / this.sides * 2 * Math.PI) * this.w, Math.sin(i / this.sides * 2 * Math.PI) * this.w);
		}
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}
	update() {
		this.x += Math.cos(this.angle) * this.speed;
		this.y += Math.sin(this.angle) * this.speed;
		if (this.x > this.w + c.width) this.dead = true;
		if (this.y > this.w + c.height) this.dead = true;
		if (this.x < -this.w) this.dead = true;
		if (this.y < -this.w) this.dead = true;
	}
}
class Launcher extends Mob {
	constructor(x, y, w) {
		super(x, y);
		this.w = 45;
		this.HP = 2;
		this.vx = 0;
		this.vy = 0;
		this.maxV = 0.5;
		this.accel = 0.1;
		this.fill = "rgba(255,25,25,0.6)";
		this.stroke = "rgba(255,255,255,0.9)";
		this.CD = 240;
		this.currCD = 240;
		this.sides = 6;
		this.angle = 0;
	}
	render() {
		this.angle += this.currCD / this.CD * 0.5;
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = this.stroke;
		ctx.fillStyle = this.fill;
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		for (var i = 0 ; i <= this.sides ; i ++) {
			ctx.lineTo(Math.cos(i / this.sides * 2 * Math.PI) * this.w, Math.sin(i / this.sides * 2 * Math.PI) * this.w);
		}
		ctx.fill();
		ctx.stroke();
		for (k = 0 ; k < this.sides / 2 ; k ++) {
			ctx.rotate(4 * Math.PI / this.sides);
			ctx.beginPath();
			ctx.moveTo(this.w,0);
			ctx.lineTo(this.w / 2, this.w / 4);
			ctx.lineTo(0,0);
			ctx.lineTo(this.w / 2, -this.w / 4);
			ctx.lineTo(this.w, 0);
			ctx.fill();
			ctx.stroke();
		}
		ctx.rotate(Math.atan2(p.y - this.y, p.x - this.x) - this.angle);
		ctx.beginPath();
		ctx.moveTo(this.w,0);
		ctx.lineTo(0,this.w / 4);
		ctx.lineTo(-this.w / 2, 0);
		ctx.lineTo(0,-this.w / 4);
		ctx.lineTo(this.w, 0);
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}
	update() {
		if (this.currCD > 0) {
			this.currCD --;
		} else {
			this.currCD = this.CD;
			proj[proj.length] = new Torp(this.x, this.y, 24, 2, Math.atan2(p.y - this.y, p.x - this.x));
		}
		if (p.x < this.x) this.vx -= this.accel;
		if (p.x > this.x) this.vx += this.accel;
		if (p.y < this.y) this.vy -= this.accel;
		if (p.y > this.y) this.vy += this.accel;
		if (this.vx > this.maxV) {
			this.vx = this.maxV;
		} else if (this.vx < -this.maxV) {
			this.vx = -this.maxV;
		}
		if (this.vy > this.maxV) {
			this.vy = this.maxV;
		} else if (this.vy < -this.maxV) {
			this.vy = -this.maxV;
		}
		this.x += this.vx;
		this.y += this.vy;
	}
	hurt() {
		this.hitCD += 10;
		shatter2(this, 4, this.w * 2);	
	}
	death() {
		shatter(this, 12, this.w * 2);
	}
}
class Bee extends Mob {
	constructor(x, y) {
		super(x, y);
		this.w = 45;
		this.HP = 1;
		this.angle = randomAngle();
		this.vx = 0;
		this.vy = 0;
		this.accel = 0.1;
		this.maxV = 3;
		this.turn = 0.2;
		this.fill = "rgba(255,200,25,0.5)";
		this.stroke = "rgba(255,200,255,0.9)";
	}
	render() {
		ctx.strokeStyle = this.stroke;
		ctx.fillStyle = this.fill;
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.beginPath();
		ctx.moveTo(this.w,0);
		ctx.lineTo(0,this.w / 2);
		ctx.lineTo(-this.w, 0);
		ctx.lineTo(0,-this.w / 2);
		ctx.lineTo(this.w, 0);
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(this.w / 2,0);
		ctx.lineTo(0,this.w);
		ctx.lineTo(-this.w / 2, 0);
		ctx.lineTo(0,-this.w);
		ctx.lineTo(this.w / 2, 0);
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}
	update() {
		this.angle = Math.atan2(p.y - this.y, p.x - this.x);
		if (p.x < this.x) this.vx -= this.accel;
		if (p.x > this.x) this.vx += this.accel;
		if (p.y < this.y) this.vy -= this.accel;
		if (p.y > this.y) this.vy += this.accel;
		if (this.vx > this.maxV) {
			this.vx = this.maxV;
		} else if (this.vx < -this.maxV) {
			this.vx = -this.maxV;
		}
		if (this.vy > this.maxV) {
			this.vy = this.maxV;
		} else if (this.vy < -this.maxV) {
			this.vy = -this.maxV;
		}
		this.x += this.vx;
		this.y += this.vy;
	}
	hurt() {
	}
	death() {
		shatter(this, 7, 90);
	}
}
class Star extends Mob {
	constructor(x, y, w) {
		super(x, y);
		this.w = w;
		this.HP = 1;
		this.nof = 10;
		this.angle = 0;
		this.slow = 0.995;
		this.turn = 0.05 * (Math.random() - 0.5);
		this.stroke = "rgba(255,200,255,0.9)";
		this.fill = "rgba(255,200,25,0.5)";
	}
	render() {
		this.angle += this.turn;
		ctx.strokeStyle = this.stroke;
		ctx.fillStyle = this.fill;
		ctx.beginPath();
		ctx.fill();
		ctx.stroke();
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		for (k = 0 ; k < this.nof ; k ++) {
			ctx.rotate(2 * Math.PI / this.nof);
			ctx.beginPath();
			ctx.moveTo(this.w,0);
			ctx.lineTo(this.w / 2, this.w / 4);
			ctx.lineTo(0,0);
			ctx.lineTo(this.w / 2, -this.w / 4);
			ctx.lineTo(this.w, 0);
			ctx.fill();
			ctx.stroke();
		}
		ctx.restore();
	}
	update() {
		if (this.angle > Math.PI) this.angle -= Math.PI * 2;
		this.x += this.vx;
		this.y += this.vy;
		this.vx *= this.slow;
		this.vy *= this.slow;
	}
	death() {
		if (this.w > 60 && this.nof > 2) {
			mob[mob.length] = new Star(this.x, this.y, this.w * 0.75);
			temp = Math.atan2(this.y - p.y,this.x - p.x);
			mob[mob.length - 1].vx = Math.cos(temp) * p.speed * p.w / this.w;
			mob[mob.length - 1].vy = Math.sin(temp) * p.speed * p.w / this.w;
			mob[mob.length - 1].nof = Math.ceil(this.nof * 0.75);
			if (Math.random() > 0.5) {
				mob[mob.length] = new Star(this.x, this.y, this.w * 0.75);
				temp = Math.atan2(this.y - p.y,this.x - p.x) + Math.random() - 0.5;
				mob[mob.length - 1].vx = Math.cos(temp) * p.speed * p.w / this.w;
				mob[mob.length - 1].vy = Math.sin(temp) * p.speed * p.w / this.w;
				mob[mob.length - 1].nof = Math.ceil(this.nof * 0.75);
				mob[mob.length - 1].HP = mob[mob.length - 1].doomHP;
			}
		}
		var ang = 0;
		for (k = 0 ; k < this.nof ; k ++) {
			ang = k / this.nof * 2 * Math.PI + (Math.random() - 0.5) * Math.PI;
			temp = (ang + p.angle) / 2 - Math.PI / 2;
			temp2 = Math.random() * 2 * Math.PI;
			eff[eff.length] = new Shard(this.x + Math.cos(ang) * this.w / 2,this.y + Math.sin(ang) * this.w / 2,
			this.w * 0.75 * Math.random(), ang, p.speed / 2 * Math.random(),temp);
		}
	}
	hurt() {
		shatter(this, p.hold);
		this.hitCD = 10;
		temp = Math.atan2(this.y - p.y,this.x - p.x);
		this.vx += Math.cos(temp) * p.speed * p.w / this.w;
		this.vy += Math.sin(temp) * p.speed * p.w / this.w;
	}
}
function shatter(q, nof, w) {
	if (w == null) w = q.w;
	for (var i = 0 ; i < nof ; i ++) {
		eff[eff.length] = new Shard((p.x + q.x) / 2, (p.y + q.y) / 2, w * Math.random() *0.5, randomAngle(), p.speed / 4 * Math.random(), randomAngle());
		if (q.fill != null) {
			eff[eff.length - 1].fill = q.fill;
			eff[eff.length - 1].stroke = q.stroke;
		}
	}
}
function shatter2(q, nof, w) {
	if (w == null) w = q.w;
	for (var i = 0 ; i < nof ; i ++) {
		eff[eff.length] = new Polygon((p.x + q.x) / 2, (p.y + q.y) / 2, w * Math.random() * 0.5, randomAngle(), p.speed / 5, randomAngle());
		if (q.fill != null) {
			eff[eff.length - 1].fill = q.fill;
			eff[eff.length - 1].stroke = q.stroke;
		}
	}
}
function onHitTest() {
	p.w += 2;console.log("hit");
}
var p = {
	"x":350,
	"y":600,
	"w":10,
	"speed":15,
	"angle":0,
	"dist":0,
	"trail":new PlayerTrail(),
	"aim":[],//onAim abilities
	"hit":[],//onhit
	"re":[],//onRelease
	//onRelease and onHit are instant, onAim is extended
	//onRelease and onHit only need a fire(), while onAim needs a behave()
	"onHit":function() {
		for (var i = 0 ; i < this.hit.length ; i ++) {
			this.hit[i]();
		}
	},
	"onRelease":function() {
		for (var i = 0 ; i < this.re.length ; i ++) {
			this.re[i]();
		}
	},
	"onAim":function() {
		for (o = 0 ; o < this.aim.length ; o ++) {
			this.aim[o].behave();
		}
	},
	"render":function() {
		this.trail.render();
		ctx.strokeStyle = "white";
		if (this.dist > 0) {
			ctx.fillStyle = rgb(255,25,25,1);
		} else {
			ctx.fillStyle = "rgba(255,255,255,1)";
		}
		ctx.save();
		ctx.beginPath();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle + Math.PI / 2);
		ctx.translate(0,-2);
		ctx.moveTo(0,-this.w);
		ctx.lineTo(this.w * 0.6, this.w * 0.5);
		ctx.lineTo(this.w, this.w);
		ctx.lineTo(-this.w, this.w);
		ctx.lineTo(-this.w * 0.6, this.w * 0.5);
		ctx.lineTo(0, -this.w);
		ctx.fill();
		ctx.stroke();
		ctx.restore();
		this.trail.update();
		if (this.dist > 0) {
			this.trail.spawn();
		}
	},
	"update":function() {
		if (keys[87] || keys[121]) {
			this.angle = Math.atan2(mouseY - this.y, mouseX - this.x);
			this.onAim();
		} else if (this.dist > 0) {
			//this.dist -= this.speed;
			this.x += Math.cos(this.angle) * this.speed;
			this.y += Math.sin(this.angle) * this.speed;
			/*if (this.dist < 0) {
				this.x += Math.cos(this.angle) * this.dist;
				this.y += Math.sin(this.angle) * this.dist;
			}*/
		}
		if (p.x > c.width - p.w) {
			p.x = c.width - p.w;
			p.vx = -Math.abs(p.vx);
			p.angle = Math.PI - p.angle;
			cam.vx += Math.cos(p.angle) * p.speed;
			cam.vy += Math.sin(p.angle) * p.speed;
		}
		if (p.y > c.height - p.w) {
			p.y = c.height - p.w;
			p.vy = -Math.abs(p.vy);
			p.angle = -p.angle;
			cam.vx += Math.cos(p.angle) * p.speed;
			cam.vy += Math.sin(p.angle) * p.speed;
		}
		if (p.x < p.w) {
			p.x = p.w;
			p.vx = Math.abs(p.vx);
			p.angle = Math.PI - p.angle;
			cam.vx += Math.cos(p.angle) * p.speed;
			cam.vy += Math.sin(p.angle) * p.speed;
		}
		if (p.y < p.w) {
			p.y = p.w;
			p.vy = Math.abs(p.vy);
			p.angle = -p.angle;
			cam.vx += Math.cos(p.angle) * p.speed;
			cam.vy += Math.sin(p.angle) * p.speed;
		}
	}
}
