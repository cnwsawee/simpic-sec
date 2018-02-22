var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/scoreboard', function(req, res){
  res.sendFile(__dirname + '/scoreboard.html');
});
app.get('/console', function(req, res){
  res.sendFile(__dirname + '/console.html');
});
app.get('/second', function(req, res){
  res.sendFile(__dirname + '/second-round.html');
});
app.get('/console2', function(req, res){
  res.sendFile(__dirname + '/console2.html');
});
app.get('/semi', function(req, res){
  res.sendFile(__dirname + '/semi.html');
});

app.use(express.static('public'));
var score=[];
for(var i=0;i<8;i++) score[i]=0;
var score2=[];
for(var i=0;i<6;i++) score2[i]=0;
io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('update', function(data){
     for(var i=1;i<8;i++){
      score[i]+=data[i];
    }
    score[0]++;
    if(score[0]==5 || score[0]==7){
      var min=1000;
      for(var j=1;j<8;j++){
        if(score[j]<min && score[j]!=-1) min=score[j];
      }
      var count=0;
      for(var j=1;j<8;j++){
        if(score[j]==min) count++;
      }
      if(count<3){
        for(var j=1;j<8;j++){
          if(score[j]==min) score[j]=-1;
        }
      }
    }
    io.emit('score',score);
    console.log('working');
    })
    socket.on('clear', function(data){
     for(var i=0;i<8;i++) score[i]=0;
       io.emit('cleared',score);
    })
    socket.on('semi', function(i,data){
      score2[i]+=data;
      io.emit('result',i,score2[i]);
    })
   socket.on('clear2', function(data){
     for(var i=0;i<6;i++) score2[i]=0;
       io.emit('cleared2',1);
    }) 

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


