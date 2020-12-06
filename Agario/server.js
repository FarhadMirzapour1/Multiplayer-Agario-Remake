//@ts-check
var all = [];
var food = [];
var players=[]

function Player(id, x, y, size,r,g,b) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.size = size;
  this.r=r;
  this.g=g;
  this.b=b;


}
//creates one 150 food objects scattered across the map
for (var i =0;i<150;i++) {
  food[i] = new Player("food",Math.random()*1000,Math.random()*1000,5,Math.random()*255,Math.random()*255,Math.random()*255);


}


var express = require('express');

var app = express();

// sets up the server
// process.env.PORT is used to allow running the app on  heroku
var server = app.listen(process.env.PORT || 3000, listen);


function listen() {
  var host = server.address().address;
  var port = server.address().port;
  
}

app.use(express.static('public'));


var io = require('socket.io')(server);

setInterval(heartbeat, 5); // calls the hearbeat function every 5 milli seconds

function heartbeat() { 
  //updates the game state (position of player and food), also keeps track of players eating eachother or food
  for (var i = players.length-1; i >= 0; i--) {
    for (var j = food.length-1;j>=0;j--) {
      //distance between players[i] and food[j]
      var distance = Math.sqrt((players[i].x-food[j].x)**2 + (players[i].y-food[j].y)**2 ); 
      // if the player is colliding with the food object
      if (distance< (players[i].size+food[j].size) - ((players[i].size+food[j].size)/10) ) { 
        
          var playerThatAte=players[i];
          playerThatAte.size = Math.sqrt((playerThatAte.size**2) + (food[j].size**2));
          
          // creates new food after a food is eaten to maintain the food count 
          food.splice(j,1, new Player("food",Math.random()*1000,Math.random()*1000,5,Math.random()*255,Math.random()*255,Math.random()*255));
          

      }
      
 
  }
 }

for (var i = players.length-1; i >= 0; i--) {
  for (var j = i-1;j>=0;j--) {
    var distance = Math.sqrt((players[i].x - players[j].x)**2 + (players[i].y - players[j].y)**2 );
    
    if (distance < (players[i].size+players[j].size) - ((players[i].size+players[j].size)/10) ) { 
      // if the distance between two players is too small checks what player has bigger size (the winner eats loser)
      if (players[i].size<players[j].size) {
        
        var playerThatAte=players[j];
        playerThatAte.size = Math.sqrt((playerThatAte.size**2) + (players[i].size**2));
        var deadId= players[i].id; // id of the dead player
        // dead player is respawned but loses all progress
        var respawn =  new Player(deadId,Math.random()*1000,Math.random()*1000,50,Math.random()*255,Math.random()*255,Math.random()*255);
        players.splice(i,1);
        players[i]=respawn;
        
      }
      else if ( players[i].size>players[j].size) {
        
        var playerThatAte=players[i];
        playerThatAte.size = Math.sqrt((playerThatAte.size**2) + (players[j].size**2));
        var deadId= players[j].id;
        var respawn = new Player(deadId,players[i].x+500,players[i].y+500,20,Math.random()*255,Math.random()*255,Math.random()*255);
        players.splice(j,1);
        players[j]= respawn;

      }
    }

  }
}

  
  io.sockets.emit('tick', food.concat(players) ); //sends the list of all food and players to the client
}


io.sockets.on(
  'connection',
  
  function(socket) {
    
    //checks for connection of new clients,
    // upon connection creates a new Player object and adds it to the players list
    socket.on('start', function(data) {
      
      var blob = new Player(socket.id, data.x, data.y, data.size,data.r,data.g,data.b);
      players.push(blob);
    });
    //takes info from the client and updates the position of the players
    socket.on('update', function(data) {

      for (var i = 0; i < players.length; i++) {
        if (socket.id === players[i].id) {
          players[i].x = data.x;
          players[i].y = data.y;
        }
      }
      
      
      
    });
    // if a client disconnects
    socket.on('disconnect', function() {
      
    });
  }
);