const net = require('net');
const { argv0 } = require('process');

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

  get getPassword(){
    return this.password
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
    this.movN = ""
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

class seat{
  constructor(){
    let strs = ['a','b','c']
    this.seats = new Object()
    for(let i=0;i<10;i++)
      for(let j=0;j<3;j++){
        this.seats[""+strs[j]+i] = 1
      }
  }
}

class movie{
  constructor(movieName){
    this.movieName = movieName
    this.seat = new seat();
  }
}

let tagMov = ["m1","m2","m3"]
let movName = ['spider man','super man','iron man']
let movies = new Object()
for(let i=0;i<3 ;i++){
  movies[tagMov[i]] = new movie(movName[i]);
}

console.log('Wait for client');

const server = net.createServer((socket) => {
  console.log('Connection from', socket.remoteAddress, 'port', socket.remotePort)
  memClient[String(socket.remotePort)] = new member(socket.remotePort);

  socket.on('data', (buffer) => {
    switch(memClient[String(socket.remotePort)].getMemState){
      case 0 : //idle
        if(buffer == "request"){
          memClient[String(socket.remotePort)].changeState(1)
          socket.write("accept");
        }
      break;
      case 1: //wait for user
        let check=0
        for(let i=0;i<manyUser;i++){
          console.log(socket.remotePort+" => user : "+buffer)
          if(""+buffer == userPass[i].getUsername){
            memClient[String(socket.remotePort)].user = userPass[i].getUsername
            memClient[String(socket.remotePort)].pass = userPass[i].getPassword
            console.log(socket.remotePort+" => correct user")
            socket.write("correct user");
            memClient[String(socket.remotePort)].changeState(2)
            check = 1
            break;
          }
        }
        if(!check){
          console.log(socket.remotePort+" => incorrect user")
          socket.write("incorrect user");
        }
      break;
      case 2: //wait password
        if(memClient[String(socket.remotePort)].pass == ""+buffer){
          memClient[String(socket.remotePort)].changeState(3)
          console.log(socket.remotePort+" => login complete")
          socket.write("correct pass")
        }else{
          socket.write("incorrect pass")
        }
      break;
      case 3: //wait number tag movie
        let checkMov = 0
        for(let i=0;i<3;i++){
          if(tagMov[i] == ""+buffer){
            memClient[String(socket.remotePort)].changeState(4)
            memClient[String(socket.remotePort)].movN = tagMov[i]
            socket.write("correct movname")
            checkMov = 1
          }
        }
        if(!checkMov){
          socket.write("incorrect movname")
        }
      break;
      case 4: //wait for seat
        let checkSeat = 0
        let st = movies[memClient[String(socket.remotePort)].movN].
                            seat.
                            seats[""+buffer] 
        if(typeof( st ) == "undefined"){
          socket.write("wrong seat")
        }else if(st == 1){
          movies[memClient[String(socket.remotePort)].movN].
                            seat.
                            seats[""+buffer] = 0
          memClient[String(socket.remotePort)].changeState(3)
          socket.write("complete")
        }else if(st ==0){
          socket.write("use to ticket")
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