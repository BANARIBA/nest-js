import { connecToServer } from './socket-client';
import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Web Socket Client</h1>
    <input id="jwt-token" placeholder="Json Web Token"/>
    <button id="btn-connect">Connect</button>
    <br>
    <p id="server-status">Disconnected!</p>

    <ul id="clients-connected">
    </ul>
    <form id="message-form">
      <input type="text" placeholder="message" id="message-input" />
    </form>

    <h3>
      Messages:
    </h3>
    <ul id="messages">
    
    </ul>
  </div>
`;
const jwtToken =  document.querySelector<HTMLInputElement>("#jwt-token")!;
const btnConnect = document.querySelector("#btn-connect")!;

btnConnect.addEventListener('click', () => {
  if (jwtToken.value.trim().length <= 0) return alert('Enter a valid Json Web Token!');
  connecToServer(jwtToken.value.trim());
});

