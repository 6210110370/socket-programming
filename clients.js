const { connect } = require('http2');
const net = require('net');
const readline = require('readline');

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
  client.write("request");
});

client.on('data', (data) => {
  msg = data
  switch(state){
    case 1:
      if(msg == "accept" ){
        console.log('Connect Completed');
        process.stdout.write("Enter your username: ");
      }else if(msg == "correct user"){
        process.stdout.write("Enter your password: ");
        state = 2;
      }else if(msg == "incorrect user"){
        process.stdout.write("Enter your username again: ");
      }
    break;
  }
});

const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => { //line msg of command line
  switch(state){
    case 1:
      client.write(""+line);
    break;
    case 2:
      client.write(""+line)
  }
});

rl.on('close', () => {
  client.end();
});