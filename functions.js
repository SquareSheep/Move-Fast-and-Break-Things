function renderRect() {
	for (i = 0 ; i < rect.length ; i ++) {
		rect[i].render();
	}
}
function updateRect() {
	for (i = 0 ; i < rect.length ; i ++) {
		if (p.x + p.w > rect[i].x - rect[i].w && p.x - p.w < rect[i].x + rect[i].w) {
			if (p.y + p.w > rect[i].y - rect[i].w && p.y - p.w < rect[i].y + rect[i].w) {
				if (p.x < rect[i].x) {
					
				} else {
					
				}
				p.dist = 0;
			}
		}
	}
}
function renderEff() {
	for (i = 0 ; i < eff.length ; i ++) {
		eff[i].render();
	}
}
function updateEff() {
	for (i = 0 ; i < eff.length ; i ++) {
		eff[i].update();
		if (eff[i].lifeSpan >= eff[i].maxLife) {
			eff.splice(i, 1);
			i --;
		}
	}
}
function renderProj() {
	ctx.fillStyle = rgb(125 + Math.floor(Math.sin(frames / 5) * 125), 25 + Math.floor(Math.sin(frames / 5) * 125), 0,1);
	ctx.strokeStyle = rgb(200 + Math.floor(Math.sin(frames / 5) * 55), 200, 200,1);
	for (i = 0 ; i < proj.length ; i ++) {
		proj[i].render();
	}
}
function updateProj() {
	for (i = 0 ; i < proj.length ; i ++) {
		proj[i].update();
		if (findDist(proj[i],p) < (proj[i].w + p.w) * (proj[i].w + p.w)) {
			cam.x += Math.cos(p.angle) * p.speed;
			cam.y += Math.sin(p.angle) * p.speed;
			shatter(proj[i],3,p.w);
			p.hold = 0;
			p.angle -= Math.PI * p.angle / Math.abs(p.angle);
			proj[i].dead = true;
		}
		if (proj[i].dead) {
			proj.splice(i, 1);
			i --;
		}
	}
}
function renderMob() {
	for (i = 0 ; i < mob.length ; i ++) {
		mob[i].render();
	}
}
function updateMob() {
	for (i = 0 ; i < mob.length ; i ++) {
		mob[i].update();
		if (mob[i].x > c.width - mob[i].w) {
			mob[i].x = c.width - mob[i].w;
			mob[i].vx = -Math.abs(mob[i].vx);
			if (mob[i].angle != null) mob[i].angle = Math.PI - mob[i].angle;
		}
		if (mob[i].y > c.height - mob[i].w) {
			mob[i].y = c.height - mob[i].w;
			mob[i].vy = -Math.abs(mob[i].vy);
			if (mob[i].angle != null) mob[i].angle = - mob[i].angle;
		}
		if (mob[i].x < mob[i].w) {
			mob[i].x = mob[i].w;
			mob[i].vx = Math.abs(mob[i].vx);
			if (mob[i].angle != null) mob[i].angle = Math.PI - mob[i].angle;
		}
		if (mob[i].y < mob[i].w) {
			mob[i].y = mob[i].w;
			mob[i].vy = Math.abs(mob[i].vy);
			if (mob[i].angle != null) mob[i].angle = - mob[i].angle;
		}
		if (mob[i].hitCD == 0) {
			if (!keys[121]) {
				if (findDist(mob[i],p) < (mob[i].w + p.w) * (mob[i].w + p.w)) {
					mob[i].HP --;
					mob[i].hurt();
					cam.vx += Math.cos(p.angle) * p.speed;
					cam.vy += Math.sin(p.angle) * p.speed;
					if (lastHitMob != mob[i]) {
						pause = 2;
						lastHitMob = mob[i];
					}
				}
			}
		} else {
			mob[i].hitCD --;
		}
		if (mob[i].HP <= 0) {
			mob[i].death();
			mob.splice(i, 1);
			i --;
		}
	}
}
function changeState(x) {
	currState = x;
	state[currState].setUp();
}
function mainLoop() {
	if (pause > 0) {
		pause --;
	}
	if (!paused) {
		state[currState].update();
		state[currState].render();
	}
	if (volumeCurr > 0) {
		ctx.fillStyle = "black";
		ctx.fillRect(c.width * 0.3, 60, c.width * 0.4, 50);
		ctx.strokeStyle = "white";
		ctx.fillStyle = "white";
		ctx.strokeText("Volume: " + volume, c.width / 2, 100);
		volumeCurr --;
	}
	frames ++;
	window.requestAnimationFrame(mainLoop);
}
function rgb(r, g, b, a) {
	if (a == null) a = 1;
	return "rgba(" + r + "," + g + "," + b + "," + a+ ")";
}
function randomRGB(r, g, b, a) {
	if (a == null) a = 1;
	return "rgba(" + Math.floor(Math.random() * r) + "," + Math.floor(Math.random() * g) + "," + Math.floor(Math.random() * b) + "," + a+ ")";
}
function mouseUp(e) {
	keys[121] = false;
	p.dist = Math.sqrt(findDist(p.x,p.y,mouseX, mouseY));
}
function resize() {
	c.width = window.innerWidth - 40;
	c.height = window.innerHeight - 40;
}
function mouseDown(e) {
	keys[121] = true;
	p.start = frames;
}
function keyDown(e) {
	if (e.keyCode == 87 && !keys[87] && !paused) {
		p.start = frames;
	}
	if (e.keyCode == 75 && !keys[75]) {
		if (volume > 0) volume -= 1;
		Howler.volume(volume / 10);volumeCurr = 30;
		localStorage.setItem("volume",volume);
	}
	if (e.keyCode == 76 && !keys[76]) {
		if (volume < 10) volume += 1;
		Howler.volume(volume / 10);volumeCurr = 30;
		localStorage.setItem("volume",volume);
	}
	keys[e.keyCode] = true;
}
function keyUp(e) {
	keys[e.keyCode] = false;
	if (e.keyCode == 80 && currState == gameState) paused = !paused;
	if (e.keyCode == 87 && !paused) {
	}
}
function mouseMove(e) {
	mouseX = e.offsetX;
	mouseY = e.offsetY;
}
function turn(ang1, ang2) {
	if (ang1 > ang2) {
		if (ang1 - ang2 > Math.PI) {
			return -1;
		}
		return 1;
	} else if (ang1 < ang2) {
		if (ang2 - ang1 > Math.PI) {
			return 1;
		}
		return -1;
	} else {
		return 0;
	}
}
function length(x, y) {
	return x * x + y * y;
}
function randomAngle() {
	return Math.PI * 2 * Math.random() - Math.PI;
}
function findDist(x1, y1, x2, y2) {
	if (x2 == null) {
		return (x1.x - y1.x) * (x1.x - y1.x) + (x1.y - y1.y) * (x1.y - y1.y);
	} else {
		return (x1 - x2) * (x1- x2) + (y1 - y2) * (y1 - y2);
	}
}
