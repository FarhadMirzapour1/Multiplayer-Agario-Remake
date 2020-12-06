
var socket;

var newPlayer; // the variable that stores the client side player

var players = []; // is supplied from the server and keeps track of all objects on the map
var oldView=1; // is used to change the zoom of the screen later on

function setup() {
  createCanvas(displayWidth+150, displayHeight-50);

  socket = io.connect('http://localhost:3000');

  //creates new player object with random colors as our new player
  newPlayer = new Player(100, 100,50,Math.random()*255,Math.random()*255,Math.random()*255);
  
  var data = { //stores necessary information about our player object
    x: newPlayer.pos.x,
    y: newPlayer.pos.y,
    size: newPlayer.size,
    r:newPlayer.r,
    g:newPlayer.g,
    b:newPlayer.b
  };
  socket.emit('start', data); //connects to the servers

  socket.on('tick', function(kap) { 
    
    players = kap; // gets information about all objects on the map from the server
  });
}

function draw() {
 
  background(255,192,203);

  

  var view = 100 / newPlayer.size; // changes the view based on player size
  translate(width / 2, height / 2); // the player is always in the centre of their own screen
 
  scale(view);
  translate(-newPlayer.pos.x, -newPlayer.pos.y);// the player is always in the centre of their own screen

  
  //draws the minimap on the top right of the screen
  fill(100,100,100);
  rect (newPlayer.pos.x+4*newPlayer.size,newPlayer.pos.y- 3.7*newPlayer.size,4*newPlayer.size,3*newPlayer.size);
  
  // goes throught all objects received from the server
  for (var i = players.length - 1; i >= 0; i--) {

     if (players[i].id===socket.id) {
       // if this specific entry of the player array is our client the newPlayer object is updated

      newPlayer.pos.x=players[i].x;
      newPlayer.pos.y=players[i].y;
      newPlayer.size=players[i].size;
      newPlayer.r=players[i].r;
      newPlayer.g=players[i].g;
      newPlayer.b=players[i].b;
      
      newPlayer.update(); // accounts for the client's movement of the player object through their mouse
      
      newPlayer.bounds();
      var data = {
        x: newPlayer.pos.x,
        y: newPlayer.pos.y,
        size: newPlayer.size,
        r: newPlayer.r,
        g: newPlayer.g,
        b: newPlayer.b
      };
    

      

      socket.emit('update', data); //sends the new position of our player to the server
    }
    
      fill(players[i].r,players[i].g, players[i].b);

      ellipse(players[i].x, players[i].y, players[i].size * 2, players[i].size * 2); //draws the object

      
      fill(0);
      textAlign(CENTER);
      textSize(4+((players[i].size)/5)); // writes the id of the player
      if (players[i].id!=="food"){ // makes sure that foods dont get their name

        text(players[i].id.substring(0,5) + "\n"+"score : " + Math.round(players[i].size), players[i].x, players[i].y );
        fill(players[i].r,players[i].g, players[i].b);
        //draws players on the mini map
        var xOfMap=newPlayer.pos.x+4*newPlayer.size;
        var yOfMap = newPlayer.pos.y-3.7*newPlayer.size;
        ellipse(xOfMap+(players[i].x/1000*4*newPlayer.size),yOfMap+(players[i].y/1000*3*newPlayer.size),players[i].size/150*newPlayer.size, players[i].size/150*newPlayer.size);
        
        


        
      }
      
     
      
      
  
  }


  
  
  

  
  
}