const dgram = require('dgram');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const LOCAL_PORT = process.argv[2] || 41234;
const TARGET_PORT = process.argv[3] || 41234;
const TARGET_ADDRESS = process.argv[4] || 'localhost';

const socket = dgram.createSocket('udp4');

socket.bind(LOCAL_PORT, () => {
    console.log(`Listening for messages on port ${LOCAL_PORT}`);
});

socket.on('message', (message, rinfo) => {
    console.log(`\n${rinfo.address}:${rinfo.port} - ${message}`);
    rl.prompt();
});

rl.question('Enter your name: ', (name) => {
    rl.setPrompt('> ');
    rl.prompt();

    rl.on('line', (line) => {
        const message = `${name}: ${line}`;
        socket.send(message, 0, message.length, TARGET_PORT, TARGET_ADDRESS, (err) => {
            if (err) {
                console.error(`Error sending message: ${err.message}`);
            }
            rl.prompt();
        });
    });
});
