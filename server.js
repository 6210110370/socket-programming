const net = require('net');

let memClient = new Object();
let userPass = new Object();

let manyUser = 0

class login{
  constructor(username,password){
    this.username = username
    this.password = password
  }

  get getUsername(){
    return this.username
  }
}

userPass[manyUser++] = new login('admin','admin')
userPass[manyUser++] = new login('test','test')

class member{
  constructor(memPort){
    this.memPort = memPort
    this.state = 0;
    this.user = ""
    this.pass = ""
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
        }
      break;
      case 1:
        console.log()
        for(let i=0;i<manyUser;i++){
          if(buffer == userPass[i].getUsername){
            memClient[String(socket.remotePort)].user = userPass[i].getUsername
            socket.write("correct user");
            memClient[String(socket.remotePort)].changeState(2)
            break;
          }
        }
        socket.write("incorrect user");
      break;
      
    }
  });

  socket.on('end', () => {
    console.log('Closed', socket.remoteAddress, 'port', socket.remotePort);
  });
});

server.maxConnections = 5;
server.listen(5000);