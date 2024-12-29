import { EventEmitter } from 'events';

const emitter = new EventEmitter();

emitter.on('greet', (name)=>{
    console.log('Good Morning', name)
});
emitter.emit('greet', 'Athulya')
emitter.emit('greet', 'Athul')

console.log('==========');

emitter.once('connect',()=>{
    console.log('This will only run once');
});
emitter.emit('connect');
emitter.emit('connect');

console.log('==========')

emitter.addListener('message',(msg)=>{
    console.log('Message recieved: ', msg)
})
emitter.emit('message', 'Hello');