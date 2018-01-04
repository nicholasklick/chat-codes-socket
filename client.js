const _ = require('underscore');
const uid = require('guid').create();
const io = require("socket.io-client");
const socket = io('http://localhost:3030');
const vorpal = require('vorpal')();
const defaultRoom = 'general';

// Main Socket Client
class SocketClient {
  constructor(socket, uid, room) {
    this.socket = socket;
    this.uid = uid;
    this.room = room;
    this.resetVorpal();
    this.subscribe({ 'event': 'message' }, function(){});
  }

  joinRoom(args, callback){
    this.room = _.pick(args, 'room').room;
    this.socket.emit('join-room', this.room, this.uid);
    this.resetVorpal();
    callback();
  }

  leaveRoom(args, callback){
    let oldRoom = _.pick(args, 'room').room;
    if(oldRoom == defaultRoom){
      console.log('Cant leave the default room: ' + defaultRoom);
    } else {
      this.socket.emit('leave-room', oldRoom, this.uid);
      this.room = defaultRoom;
      this.resetVorpal();
    }
    callback();
  }

  sendMessage(args, callback){
    let message = _.pick(args, 'message').message;
    let event = _.pick(args, 'event').event || 'message';
    this.socket.emit('send-message', this.room, message, event);
    callback();
  }

  subscribe(args, callback){
    let event = _.pick(args, 'event').event
    let that = this;
    this.socket.on(event, function(data) {
      console.log(data);
      that.resetVorpal();
    });
    callback();
  }

  unsubscribe(args, callback){
    let event = _.pick(args, 'event').event;
    this.socket.off(event);
    callback();
  }

  resetVorpal(){
    vorpal
      .delimiter(this.room+'-chat>')
      .show();
  }

}

// Initialize and Setup
let client = new SocketClient(socket, uid, defaultRoom); 

// Custom REPL using Vorpal
vorpal.command('\\join <room>')
  .description('Joins a room.')
  .alias('\\j')
  .action(function(args, cb){
    return client.joinRoom(args, cb);
  });

vorpal.command('\\leave <room>')
  .description('Leaves a room.')
  .alias('\\l')
  .action(function(args, cb){
    return client.leaveRoom(args, cb);
  });  

vorpal.command('\\send <message> [event]')
  .description('Sends message to room.')
  .alias('\\s')
  .action(function(args, cb){
    return client.sendMessage(args, cb);
  });  

vorpal.command('\\subscribe <event>')
  .description('Subscribes to an event type.')
  .alias('\\sub')
  .action(function(args, cb){
    return client.subscribe(args, cb);
  });  

vorpal.command('\\unsubscribe <event>')
  .description('Unsubscribes to an event type.')
  .alias('\\un')
  .action(function(args, cb){
    return client.unsubscribe(args, cb);
  });      
