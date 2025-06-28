import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

interface ConnectedClients {
  [id: string]: {
    user: User;
    socket: Socket;
  };
}

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {};

  constructor (
    private readonly usersService: UsersService,
  ) {}

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  async registerClient(client: Socket, userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new Error('User not found!');
    if (!user.isActive) throw new Error('User is not active!');

    this.checkUserIsConnected(userId);
    
    this.connectedClients[client.id] = {
      socket: client,
      user: user,
      // isDesktop: true,
      // idMobile: false,
    };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getUserFullName(socket: string) {
    return this.connectedClients[socket].user.fullName;
  }

  private checkUserIsConnected(userId: string) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];

      // Si el cliente conectado es el mismo que el que estamos buscando, entonces lo desconectamos
      if (connectedClient.user.id === userId) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }
}
