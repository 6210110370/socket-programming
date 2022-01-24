const { connect } = require('http2');
const net = require('net');
const readline = require('readline');

let msg = ""

let state = 0
/*
  0 = start
  1 = ide
  2 = wait for user name
  3 = wait for password
  4 = wait for number tag of movie
  5 = wait for tag of seat
  6 = end
*/

const client = new net.Socket();
client.connect(5000, process.argv[2], () => {
  console.log('Connected to server...');
  state = 1
  client.write("request"); //idle
});

client.on('data', (data) => {
  msg = data
  switch(state){
    case 1: //send for user
      if(""+msg == "accept" ){
        console.log('Connect Completed');
        process.stdout.write("Enter your username: ");
      }else if(""+msg == "correct user"){
        process.stdout.write("Enter your password: ");
        state = 2;
      }else if(""+msg == "incorrect user"){
        process.stdout.write("Enter your username again: ");
      }
    break;
    case 2: //send password
      if(""+msg == "correct pass"){
        process.stdout.write("Enter movie tag: ");
        state = 3
      }else if(""+msg == "incorrect pass"){
        process.stdout.write("Enter your password again: ");
      }
    break;
    case 3: //send number tag movie
      if(""+msg == "correct movname"){
        process.stdout.write("Enter seat tag: ");
      }else if(""+msg == "incorrect movname"){
        process.stdout.write("Enter seat tag again: ");
      }
    break;
    case 4: //send for seat
    break;

  }
});

const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => { //line msg of command line
     client.write(""+line)
});

rl.on('close', () => {
  client.end();
});