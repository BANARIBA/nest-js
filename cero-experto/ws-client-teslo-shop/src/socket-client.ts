import { Manager, Socket } from "socket.io-client";

let socket: Socket;

export const connectToServer = (token: string) => {
  const manager = new Manager(`http://localhost:4000/socket.io/socket.io.js`, {
    extraHeaders: {
      hola: "mundo",
      authentication: token,
    },
  });
  socket?.removeAllListeners(); // Eliminar todos los listeners para evitar duplicados, si no es undefined o null que los remueva 
 
  // que se conecte al servidor y le pase el token de autenticacion
  socket = manager.socket("/");
  addListeners();
};

const addListeners = () => {
  const serverStatus =
    document.querySelector<HTMLSpanElement>("#server-status")!;
  const clientsConnectedList = document.querySelector<HTMLUListElement>(
    "#clients-connected-list"
  )!;
  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messageInput =
    document.querySelector<HTMLInputElement>("#message-input")!;
  const messagesList =
    document.querySelector<HTMLUListElement>("#messages-list")!;

  // emit es para hablar con el servidor
  socket.on("connect", () => {
    console.log("Connected to server");
    serverStatus.innerHTML = "CONNECTED!";
  });

  // Desconectar
  socket.on("disconnect", () => {
    console.log("Disconnected to server");
    serverStatus.innerHTML = "DISCONNECTED!";
  });

  // Este se dispara cada vez que se conecta o desconecta un cliente nuevo, el servidor lo emite y aqui lo recibimos
  // y lo mostramos en la lista de clientes conectados
  socket.on("clients-updated", (clients: string[]) => {
    let clientsHtml: string = "";
    clients.forEach((client) => {
      clientsHtml += `<li>${client}</li>`;
    });
    clientsConnectedList.innerHTML = clientsHtml;
  });

  // Codigo que se ejecuta cuando el servidor emite un evento "message-from-server" en el formulario
  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (messageInput.value.trim().length <= 0) return;

    socket.emit("message-from-client-form", {
      id: "yo!!!",
      message: messageInput.value,
    });
  });

  // Esta conexion se dispara cada ver que el servidor emite el evento proveniente del submit del formulario y que se envia al server
  socket.on(
    "message-from-server",
    (payload: { fullName: string; message: string }) => {
      let newMessageHtml = `<li><strong>${payload.fullName}</strong>: <span>${payload.message}</span></li>`;
      const li = document.createElement("li");
      li.innerHTML = newMessageHtml;
      messagesList.append(li);
    }
  );
};
