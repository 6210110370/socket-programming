const net = require('net');
let state = 0
let memClient = new Object();

class member{
  constructor(memPort){
    this.memPort = memPort
    this.state = 0;
  }

  changeState(state){
    this.state = state
  }

  get getMemState(){
    return this.state
  }

  get getMemPort(){
    return this.memPort
  }

}

console.log('Wait for client');

const server = net.createServer((socket) => {
  console.log('Connection from', socket.remoteAddress, 'port', socket.remotePort)
  memClient[String(socket.remotePort)] = new member(socket.remotePort);
  socket.on('data', (buffer) => {
    switch(memClient[String(socket.remotePort)].getMemState){
      case 0 :
        if(buffer == "request"){
          memClient[String(socket.remotePort)].changeState(1)
          socket.write("accept");
          console.log('Connect Completed',memClient[String(socket.remotePort)]);
        } 
      break;
      
    }
  });

  socket.on('end', () => {
    console.log('Closed', socket.remoteAddress, 'port', socket.remotePort);
  });
});

server.maxConnections = 5;
server.listen(5000);