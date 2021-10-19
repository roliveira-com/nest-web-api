import { Injectable } from '@nestjs/common';

import { User, UserAuth } from './model/user.interface';
import { HttpAppResponse } from './model/response.interface';
import { Stream } from 'stream';
import { StreamState } from 'http2';
import { ServerResponse } from 'http';

@Injectable()
export class AppService {
  public usersList: User[] = [];
  public notification: any = {};
  public clients = []
 

  getUser(): User[] {
    return this.usersList;
  }

  subscribeNotifications(request: Stream, response: ServerResponse, name: string = 'guest'){
    const client = {
      id: Date.now(),
      name,
      res: response
    }

    this.clients = [ ...this.clients, client ];

    request.on('close', () => {
      console.log(`${client.id} Connection closed`);
      this.clients = this.clients.filter(c => c.id !== client.id);
    })

    response.write(`data: ${JSON.stringify(this.notification)}\n\n`)
  }

  sendNotifications(message, targets = null): Promise<any>{
    return new Promise((resolve, reject) => {
      const channel = message.channel;
  
      this.notification = { 
        ...message,
        date: new Date().toLocaleString()
      };
  
      if(channel){
        targets = this.clients.filter(client => client.name === channel);
        if(!targets) {
          reject('O canal especificado não existe')
        }
      } else {
        targets = this.clients;
      }

      targets.forEach(client => {
        client.res.write(`data: ${JSON.stringify(this.notification)}\n\n`);
      })

      resolve({ message: `Mensagem enviada para o canal ${channel || 'guest'}` });

      this.notification = null;
    })

  }

  addUser(user: User): HttpAppResponse {
    this.usersList = [ ...this.usersList, user ]
    return {
      code: 201,
      error: false,
      response: user
    }
  }

  generateToken(username: string): HttpAppResponse {
    return {
      code: 200,
      error: false,
      response: {
        username: username,
        token: Buffer.from(username).toString('base64')
      }
    }
  }

  loginAdmin(auth: UserAuth, response): HttpAppResponse {
    if(auth.login === 'admin' && auth.pass === '1234ceara') {
      return response.status(201).send({
        code: 200,
        error: false,
        response: {
          username: auth.login,
          token: Buffer.from(auth.login + Date.now().toString() + auth.pass).toString('base64')
        }
      })
    } else {
      return response.status(401).send({
        code: 401,
        error: true,
        response: {
          username: auth.login,
          token: null,
          message: 'Login ou senha inválidos'
        }
      })
    }
  }
}
