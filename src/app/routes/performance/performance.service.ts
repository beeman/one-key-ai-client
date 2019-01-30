import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private socket: SocketIOClient.Socket = null;
  private message$: Observable<any> = null;

  constructor() {
    this.openSocket();
  }

  public message() {
    return this.message$;
  }

  public startGetMessage() {
    if (!this.socket) {
      this.openSocket();
    }
    if (this.socket.disconnected) {
      this.socket.on('connect', (data) => {
        this.socket.emit('getMessage');
      });
    } else {
      this.socket.emit('getMessage');
    }
  }

  public stopGetMessage() {
    if (this.socket) {
      this.socket.emit('stopGetMessage');
    }
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
    this.message$ = fromEvent<string>(this.socket, 'message');
  }
}
