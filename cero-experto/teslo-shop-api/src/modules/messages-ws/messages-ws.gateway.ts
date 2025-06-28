import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-mesagge.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from '../auth/interfaces/jwt.interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    // console.log(`Client ${client.id} Connected! `);
    // El token se que enviamos con el boton connect en el cliente, en este caso es un string, pero puede ser cualquier cosa, como un objeto o un array
    const token = client.handshake.headers.authentication as string;
    // console.log({ token });

    let payload: JWTPayload;

    try {
      payload = this.jwtService.verify(token);
      // Aqui agregamos el cliente a la cola de lista de clientes conectados
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    // Notificando a todos los clientes que estan conectados que hay un nuevo cliente conectado
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    // console.log(`Client ${client.id} Disconnected! `);
    this.messagesWsService.removeClient(client.id);

    // Notificando a todos los clientes que estan conectados que hay un nuevo cliente se ha desconectado tambien
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  // Aqui escuchamos el evento 'message-from-client-form' que es el que envia el cliente, es el formulario que simula el chat o envio de mensajes a los demas clientes conectados
  @SubscribeMessage('message-from-client-form')
  onMessageFromClientForm(client: Socket, payload: NewMessageDto) {
    // console.log(client.id, payload);

    // Esto solo emite el mensaje unicamente al cliente que lo envio, no a todos los demas clientes conectados
    // client.emit("message-from-server", { fullName: 'bsancheza', message: payload.message || 'No message!' });

    // Este emite el mensaje a todos los clientes conectados, excluyendo al que lo envio
    // client.broadcast.emit('message-from-server', { fullName: 'bsancheza', message: payload.message || 'No message!' });

    // Este emite el mensaje a todos los clientes conectados, incluyendo al que lo envio
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'No message!',
    });

    // Tambien se puede enviar a solo un cliente especifico, en este caso al cliente que lo envio
    // this.wss.to(client.id).emit('message-from-server', { fullName: 'bsancheza', message: payload.message || 'No message!' });
  }
}
