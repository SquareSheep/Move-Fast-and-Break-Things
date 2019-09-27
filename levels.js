level[0] = {
  "isClear":false,
  "frames":0,
  "setUp":function() {
    this.isClear = false;
    this.frames = 0;
	mob[mob.length] = new Star(100,c.height / 2,75);
	mob[mob.length] = new Star(c.width / 2,100,75);
	mob[mob.length] = new Star(c.width / 2,c.height - 100,75);
	mob[mob.length] = new Star(c.width - 100,c.height / 2,75);
	mob[mob.length] = new Launcher(c.width / 2,c.height / 2, 35);
	rect[rect.length] = new Rect(100,100,20,20);
  },
  "update":function() {
	  if (frames % 60 == 0 && mob.length < mobLimit) {
		 mob[mob.length] = new Bee(Math.random() * c.width,Math.random() * c.height);
	}
	if (this.frames > 360 || mob.length < 3) this.isClear = true;
  }
}