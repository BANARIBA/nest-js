import { connectToServer } from "./socket-client";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h2>Web Socket Teslo Shop - Client</h2>

    <input id="jwt-token" placeholder="Json Web Token"/>
    <button id="btn-connect">Connect</button>

    <br/>

    <span id="server-status">Offline</span>

    <ul id="clients-connected-list">
    </ul>

    <form id="message-form">
      <input placeholder="message" id="message-input" type="text" />
    </form>

    <h3>Messages</h3>
    <ul id="messages-list">
    </li>

  </div>
`;


const jwtToken = document.querySelector<HTMLInputElement>("#jwt-token")!;
const btnConnect = document.querySelector<HTMLButtonElement>("#btn-connect")!;

btnConnect.addEventListener("click", () => {
  // console.log('CONNECTING...');
  if (jwtToken.value.trim().length <= 0) return alert("JWT token is required");

  connectToServer(jwtToken.value.trim());
});
