var ctx; var c = {"width":700,"height":700};
var frames = 0;var pause = 0;
var b, back, f, fore;
var mouseX = 0; var mouseY = 0;
var keys = [];
var i,k,j,u,o,m,l,temp,speed,temp2,dist,count, ang, angle; var lastHitMob = null;
var rad = 16; var mobLimit = 5;
var volume = 5;var volumeCurr = 0; var paused = false;
var state = []; var mapState = 0; var gameState = 1; var selectState = 2; var currState = gameState;
var mob = []; var eff = []; var proj = []; var rect = [];
var level = []; var currLevel = 0;

state[mapState] = {
	"render":function() {
		ctx.clearRect(0,0,c.width, c.height);
		p.render();
		//ctx.strokeText("Press R", c.width / 2, 600);
		//ctx.strokeText("to start", c.width / 2, 640);
	},
	"setUp":function() {
		cam.vx = 0;
		cam.vy = 0;
		cam.x = 0;
		cam.y = 0;
		proj.length = 0;
		rect.length = 0;
		mob.length = 0;
		eff.length = 0;
		paused = false;
		frames = 0;
		ctx.clearRect(0,0,c.width,c.height);
		back.clearRect(0,0,b.width,b.height);
	},
	"update":function() {
		p.update();
		if (keys[82]) {
			changeState(gameState);
		}
	}
}
state[selectState] = {
	"render":function() {
		ctx.clearRect(0,0,c.width, c.height);
		p.render();
		ctx.strokeText("Press R", c.width / 2, 600);
		ctx.strokeText("to go to next level", c.width / 2, 640);
	},
	"setUp":function() {
		cam.vx = 0;
		cam.vy = 0;
		cam.x = 0;
		cam.y = 0;
		paused = false;
		frames = 0;
		ctx.clearRect(0,0,c.width,c.height);
		back.clearRect(0,0,b.width,b.height);
	},
	"update":function() {
		p.update();
		if (keys[82]) {
			if (level[currLevel + 1] != null) currLevel ++;
			changeState(gameState);
		}
	}
}
state[gameState] = {
	"render":function() {
		if (frames % 3 == 0) {
			back.fillStyle = "rgba(0,0,0,0.1)";
			back.fillRect(0,0,b.width, b.height);
		}
		ctx.clearRect(0,0,c.width, c.height);
		cam.behave();
		ctx.translate(cam.x, cam.y);
		back.translate(cam.x, cam.y);
		renderEff();
		p.render();
		renderMob();
		renderProj();
		renderRect();
		ctx.translate(-cam.x, -cam.y);
		back.translate(-cam.x, -cam.y);
	},
	"setUp":function() {
		cam.vx = 0;
		cam.vy = 0;
		cam.x = 0;
		cam.y = 0;
		paused = false;
		frames = 0;
		ctx.clearRect(0,0,c.width,c.height);
		back.fillStyle = "black";
		back.fillRect(0,0,b.width,b.height);
		proj.length = 0;
		rect.length = 0;
		mob.length = 0;
		eff.length = 0;
		level[currLevel].setUp();
	},
	"update":function() {
		level[currLevel].update();
		level[currLevel].frames ++;
		if (level[currLevel].isClear) {
			changeState(selectState);
		}
		updateEff();
		if (pause == 0) {
			p.update();
		}
		updateMob();
		updateProj();
		updateRect();
	}
}
function start() {
	c = document.getElementById("ctxCanvas");
	ctx = c.getContext("2d");
	c.width = 700;
	c.height = 700;
	ctx.lineWidth = 2;
	b = document.getElementById("backCanvas");
	back = b.getContext("2d");
	f = document.getElementById("foreCanvas");
	fore = f.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	document.addEventListener("keydown", keyDown);
	document.addEventListener("keyup", keyUp);
	f.addEventListener("mousemove", mouseMove, false);
	f.width = 700;
	f.height = 700;
	b.width = 700;
	b.height = 700;
	back.fillStyle = "grey";
	back.fillRect(0,0,b.width,b.height);
	back.strokeStyle = "white";
	back.strokeRect(0, 0, b.width, b.height);
	ctx.font = "36px Arial";
	ctx.textAlign = "center";
	changeState(mapState);
	mainLoop();
}
