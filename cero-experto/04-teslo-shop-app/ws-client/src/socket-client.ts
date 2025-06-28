import {Manager, Socket} from 'socket.io-client';

// importantisimo declararlo global
let socket: Socket;

export const connecToServer = (token: string) => {
  const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
    extraHeaders: {
      authentication: token,
    },
  });

  // Nos conectamos al namespace del backend
  socket?.removeAllListeners(); // si existe un socket ya cargado eliminalo para crear uno nuevo
  socket = manager.socket('/');
  // console.log('Socket: ', socket)
  addListeners();
}

const addListeners = () => {

  const serverStatusLabel = document.querySelector('#server-status')!;
  const messageInput = document.querySelector<HTMLInputElement>("#message-input")!;
  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messages = document.querySelector("#messages")!;

  // on para escuchar el estado del server, emit es para hablar con ser server
  socket.on('connect', () => {
    // console.log('Connected');
    serverStatusLabel.innerHTML = 'Connected!';
  });

  socket.on('disconnect', () => {
    // console.log('Disconnected');
    serverStatusLabel.innerHTML = 'Disconnected!';
  });

  socket.on('clients-updated', (clients: string[]) => {
    console.log({clients})
    let clientsConnectedList = '';
    const clientsConnected = document.querySelector('#clients-connected')!;
    clients.forEach(client => {
      clientsConnectedList += `<li>${client}</li>`;
    });
    clientsConnected.innerHTML = clientsConnectedList;
  });

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault()
    if (messageInput.value.trim().length <= 0) return;

    // console.log({id: 'Yo!!', message: messageInput.value});

    // Mandamos la informacion al backend para que la reciba
    socket.emit('message-from-client', {
      id: 'Yo!',
      message: messageInput.value,
    });

    messageInput.value = '';
  });
  
  socket.on("message-from-server", (payload: {full_name: string, message: string}) => {
    console.log(payload);
    let newMessage = `
      <strong>${payload.full_name}</strong>
      <span>${payload.message}</span>
    `;
    const li = document.createElement('li');
    li.innerHTML = newMessage;
    messages.append(li);
  });
}