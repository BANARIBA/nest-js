import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

/*
  namespace: es como sala de chat por ejemplo sala de 
  tu casa al ver una peli y todos los que van a ver la 
  peli serian los clientes o personas, ojo a esto
*/

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() webSocketServer: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService, 
    private readonly jwtService: JwtService
  ) {}

  public async handleConnection(client: Socket) {
    // Se registra el cliente conectado
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      // console.log({payload});
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      // si da un error al verificar el token desconectamos el cliente que se quiere conectar
      client.disconnect();
      return;
    }

    console.log(`Client ${client.id} with token: ${/*token*/ 'discomment token' } connected!, Clients Connected: ${this.messagesWsService.getConnectedClients()}`);

    // Cuando se connecta uno nueva persona, se emite al frontend el listado actualizado con el nuevo cliente conectado
    this.webSocketServer.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  public handleDisconnect(client: Socket) {
    // Se elimina el cliente conectado
    this.messagesWsService.removeClient(client.id);
    console.log(`Client ${client.id} disconnect!, Clients Connected: ${this.messagesWsService.getConnectedClients()}`);

    // Cuando se desconecta tambien uno persona, se emite al frontend el listado actualizado con el nuevo cliente conectado
    this.webSocketServer.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  // Esto sirve para capturar los mensajes del frontend: message-from-client
  @SubscribeMessage('message-from-client')
  public onMessageFromClient (client: Socket, payload: NewMessageDto) {
    console.log({id: client.id, message: payload});

    // Para solo emitir a la persona con la que hablas, esto emite al cliente del que envia
    // client.emit('message-from-server', {full_name: 'Yo!', message: payload.message || "No message"});

    // Para emitir a todos los demas clientes menos al que envia el mensaje
    // client.broadcast.emit('message-from-server', {full_name: 'Yo!', message: payload.message || "No message"});

    // Para emitir tanto a todos los demas clientes y el cliente que envia el mensaje
    this.webSocketServer.emit('message-from-server', {
      full_name: this.messagesWsService.getUserByFullName(client.id), 
      message: payload.message || "No message"
    });
  }

}
