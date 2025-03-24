/* connection.js
Description: Handles socket connection to the fightboat server
Inputs: None
Outputs: Socket connection to server
Sources: socket.io documentation
Authors: William Johnson
Creation date: 9-11-24
*/

// Cloud server address
const SERVER_URL = 'https://battleship-q6f4.onrender.com';

// Create socket connection
const socket = io(SERVER_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket']
});

// Connection event handlers
socket.on('connect', () => {
    console.log('Connected to fightboat server');
    window.socket = socket;
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});

socket.on('disconnect', (reason) => {
    console.log('Disconnected from fightboat server:', reason);
});

// Export socket for use in other files
window.socket = socket; 