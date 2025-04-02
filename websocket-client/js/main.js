const socket = new WebSocket('ws://localhost:5001');

const slider1 = document.getElementById('slider1');
const slider1Value = document.getElementById('slider1Value');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Update slider value display
slider1.addEventListener('input', () => {
    slider1Value.textContent = slider1.value;
    socket.send(JSON.stringify({ key: 'slider1', value: slider1.value }));
});

// WebSocket event listeners
socket.addEventListener('open', () => {
    messagesDiv.innerHTML += '<p>Connected to WebSocket server</p>';
});

socket.addEventListener('message', (event) => {
    try {
    const data = event.data ? JSON.parse(event.data) : {};
    console.log(data);
    if (data.slider1 && typeof data.slider1 === 'number') {
        slider1.value = data.slider1 * 100;
        slider1Value.textContent = data.slider1 * 100;
    } else {
        messagesDiv.innerHTML += `<p>Server: ${event.data}</p>`;
    }
    } catch (e) {
    console.error('Invalid message format', e);
    }
});

socket.addEventListener('close', () => {
    messagesDiv.innerHTML += '<p>Disconnected from WebSocket server</p>';
});

// Send message to WebSocket server
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
    socket.send(message);
    messagesDiv.innerHTML += `<p>You: ${message}</p>`;
    messageInput.value = '';
    }
});