const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const PORT = 12345; // Hardcoded port number
const HOST = 'localhost'; // Target host

const messages = ['hello', 'hi', 'whatsup'];

setInterval(() => {
    // Randomly select a message
    const message = Buffer.from(messages[Math.floor(Math.random() * messages.length)]);
    client.send(message, 0, message.length, PORT, HOST, () => {
        console.log(`Message sent to ${HOST}:${PORT}: ${message}`);
    });
}, 3000); // 3000 milliseconds = 3 seconds
