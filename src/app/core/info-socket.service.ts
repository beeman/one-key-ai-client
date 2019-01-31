import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';

import * as io from 'socket.io-client';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class InfoSocketService {
  private socket: SocketIOClient.Socket = null;

  constructor(private readonly logger: NGXLogger) {
    this.openSocket();
  }

  public getSocket(): SocketIOClient.Socket {
    return this.socket;
  }

  public performanceMessage() {
    return fromEvent<string>(this.socket, 'performance');
  }

  private closeSocket(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private openSocket(): void {
    this.closeSocket();
    this.socket = io('http://localhost:3000');
  }
}
