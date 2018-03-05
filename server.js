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
app.get('/consolefin', function(req, res){
  res.sendFile(__dirname + '/console-final.html');
});
app.get('/scorefin', function(req, res){
  res.sendFile(__dirname + '/scoreboard-final.html');
});
app.get('/judgesemi', function(req, res){
  res.sendFile(__dirname + '/judge-semi.html');
});
app.get('/judgefin', function(req, res){
  res.sendFile(__dirname + '/judge-fin.html');
});
app.get('/judgesec', function(req, res){
  res.sendFile(__dirname + '/judge-sec.html');
});

app.use(express.static('public'));
var score=[];
for(var i=0;i<8;i++) score[i]=0;
var score2=[];
var scorefin=[];
var judgesecond=[];
var judgefinal=[];
for(var i=0;i<6;i++) score2[i]=0;
for(var i=1;i<5;i++) scorefin[i]=0;
for(var i=1;i<8;i++) judgesecond[i]=0;
for(var i=1;i<5;i++) judgefinal[i]=0;
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
    });

    socket.on('clear', function(data){
     for(var i=0;i<8;i++) score[i]=0;
       io.emit('cleared',score);
    });

    socket.on('semi', function(i,data){
      score2[i]+=data;
      io.emit('result',i,score2[i]);
    });

    socket.on('sendfin',function(data){
      for(var i=1;i<5;i++){
            if(data[i]==0) scorefin[i]=scorefin[i]*4/5;
            if(data[i]==1) scorefin[i]+=20;
          }
      io.emit('scorefin',scorefin);
    });

   socket.on('clear2', function(data){
     for(var i=0;i<6;i++) score2[i]=0;
       io.emit('cleared2',1);
    });

   socket.on('clearfin', function(data){
     for(var i=1;i<5;i++) scorefin[i]=0;
       io.emit('clearedfin',scorefin);
    }); 
   socket.on('judgesemi', function(data){
      io.emit('judgesemi2',data);
   });
   socket.on('judgesec', function(i){
      judgefinal[i]++;
      if(i==0){
        for(var j=0;j<8;j++){
          judgefinal[j]=0;
          io.emit('judgesec2',j,judgefinal[j]);
        }

      }
      io.emit('judgesec2',i,judgefinal[i]);
   });
   socket.on('judgefin', function(i){
      judgefinal[i]++;
      if(i==0){
        for(var j=0;j<8;j++){
          judgefinal[j]=0;
          io.emit('judgefin2',j,judgefinal[j]);
        }

      }
      io.emit('judgefin2',i,judgefinal[i]);
   });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


