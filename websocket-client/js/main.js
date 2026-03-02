const serverAddressInput = document.querySelector('#server-address');
const connectButton = document.querySelector('#connect-button');
const disconnectButton = document.querySelector('#disconnect-button');
const slider1 = document.querySelector('#slider-1');
const slider1Value = document.querySelector('#slider-1-value');
const messageList = document.querySelector('#message-list');
const messageInput = document.querySelector('#message-input');
const sendButton = document.querySelector('#send-button');

let socket;

// Connect to WebSocket server
connectButton.addEventListener('click', () => {
    const address = serverAddressInput.value || 'ws://localhost:5001';
    socket = new WebSocket(address);

    socket.addEventListener('open', () => {
        messageList.innerHTML += '<p>Connected to WebSocket server</p>';
        connectButton.disabled = true;
        disconnectButton.disabled = false;
    });

    socket.addEventListener('message', (event) => {
        try {
            const data = event.data ? JSON.parse(event.data) : {};
            console.log(data);
            if (data.slider1 && typeof data.slider1 === 'number') {
                slider1.value = data.slider1 * 100;
                slider1Value.textContent = data.slider1 * 100;
            } else {
                messageList.innerHTML += `<p>Server: ${event.data}</p>`;
            }
        } catch (e) {
            console.error('Invalid message format', e);
        }
    });

    socket.addEventListener('close', () => {
        messageList.innerHTML += '<p>Disconnected from WebSocket server</p>';
        connectButton.disabled = false;
        disconnectButton.disabled = true;
    });
});

// Disconnect from WebSocket server
disconnectButton.addEventListener('click', () => {
    socket.close();
});

// Update slider value display
slider1.addEventListener('input', () => {
    slider1Value.textContent = slider1.value;
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ key: 'slider1', value: slider1.value }));
    }
});

// Send message to WebSocket server
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message && socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        messageList.innerHTML += `<p>You: ${message}</p>`;
        messageInput.value = '';
    }
});