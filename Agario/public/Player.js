// Player object that has its position stored at row x and column y
// also keeps track if its color in variables r,g,b
function Player(x, y, size,r,g,b) {

    this.pos = createVector(x,y);
    this.size = size;
    this.r=r;
    this.g=g;
    this.b=b;
    this.update = function() { 
      //updates the position of player relative to mouse movement
      this.pos.add(createVector(mouseX - width / 2, mouseY - height / 2).setMag(1));
    };
    this.bounds = function() {
      // bounds the player object so it can't go over the boundries of the map
      if (this.pos.x<-0) {
        this.pos.x=0;
      }
      if (this.pos.y<-0) {
        this.pos.y=0;
      }
      if (this.pos.x>1000) {
        this.pos.x=1000;
      }
      if (this.pos.y>1000) {
        this.pos.y=1000;
      }

    };
    this.draw = function() {
      // draws the player on the canvas
      fill(255);
      ellipse(this.pos.x, this.pos.y, this.size * 2, this.size * 2);
    };

  }