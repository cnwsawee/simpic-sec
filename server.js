var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/scoreboard', function(req, res){
  res.sendFile(__dirname + '/scoreboard.html');
});
app.get('/scoreboard2', function(req, res){
  res.sendFile(__dirname + '/scoreboard2.html');
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
app.get('/scorefin2', function(req, res){
  res.sendFile(__dirname + '/scoreboard-final2.html');
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
app.use(express.static('images'));
var jsocket=io.of('/score');
var score=[];
for(var k=1;k<9;k++) score[k]=0;
var score2=[];
var scorefin=[0];
var judgesecond=[];
var judgefinal=[];
for(var k=0;k<6;k++) score2[k]=0;
for(var k=1;k<5;k++) scorefin[k]=0;
for(var k=1;k<9;k++) judgesecond[k]=0;
for(var k=1;k<6;k++) judgefinal[k]=0;
io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('update', function(data){
       for(var i=1;i<8;i++){
        score[i]+=data[i];
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
      judgesecond[i]++;
      if(i==0){
        for(var j=0;j<9;j++){
          judgesecond[j]=0;
          io.emit('judgesec2',j,judgesecond[j]);
        }

      }
      io.emit('judgesec2',i,judgesecond[i]);
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
   socket.on('elim',function(data){
            io.emit('eliminated',data);
   });
   socket.on('sendfin',function(data){
      console.log(1);
      for(var i=1;i<5;i++){
            if(data[i]==-1) scorefin[i]=scorefin[i]*4/5;
            if(data[i]==1) scorefin[i]+=10;
          }
      io.emit('scorefin',scorefin);
    });
   socket.on('scorefinOverride',function(data){
      for(var i=1;i<5;i++){
          scorefin[i]=data[i];
      }
      io.emit('scorefin',scorefin);
   })
});



jsocket.on('connection',function(socket){
  socket.on('scoreFinal',function(data){
      console.log(1);
      for(var i=1;i<5;i++){
            if(data[i]==-1) scorefin[i]=scorefin[i]*4/5;
            if(data[i]==1) scorefin[i]+=10;
          }
      io.emit('scorefin',scorefin);
    });
  socket.on('scoreSecond', function(data){
     for(var i=1;i<8;i++){
      score[i]+=data[i];
    }
    io.emit('score',score);
    console.log('working');
  });
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});


