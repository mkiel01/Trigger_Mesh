const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const PORT = 12345;
const HOST = 'localhost';

const messages = ['hello', 'hi', 'whatsup'];

setInterval(() => {
    const message = Buffer.from(messages[Math.floor(Math.random() * messages.length)]);
    client.send(message, 0, message.length, PORT, HOST, () => {
        console.log(`Message sent to ${HOST}:${PORT}: ${message}`);
    });
}, 3000);
