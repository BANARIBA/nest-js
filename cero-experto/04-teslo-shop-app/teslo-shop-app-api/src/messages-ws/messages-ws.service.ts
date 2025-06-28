import { Injectable } from '@nestjs/common';
import { ConnectedClients } from './interfaces';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesWsService {

  private connectedClients: ConnectedClients = {};

  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async registerClient (client: Socket, user_id: string) {
    const user = await this.userRepository.findOneBy({id: user_id});

    if (!user) throw new Error('User not found');
    if (!user.is_active) throw new Error('User is inactive');

    // Verificamos si el usuario ya esta conectado y lo desconectamos para volverlo a conectar
    // Herrera aclara que se pueden tener varias conexiones por el mismo usuario pero habria que identificar
    // por ejemplo si es por mobile o un pc expandiendo la interfaz ConnectedClients
    this.checkUserConnection(user);

    this.connectedClients[client.id] = {
      socket: client,
      user: user,
    };
  }

  public getUserByFullName (socketId: string) {
    return this.connectedClients[socketId].user.full_name;
  }

  public removeClient (clientId: string) {
    delete this.connectedClients[clientId];
  }

  public getConnectedClients (): string[] {
    return Object.keys(this.connectedClients);
  }

  public checkUserConnection (user: User) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];
      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }

}
