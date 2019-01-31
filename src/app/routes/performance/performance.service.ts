import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    this.message$ = fromEvent<string>(this.socket, 'message').pipe(
      map((value) => {
        const jsonValue = JSON.parse(value);
        jsonValue.top.time = this.parseTime(jsonValue.top.time);
        return jsonValue;
      }),
    );
  }

  private parseTime(data: any): Date {
    const timeValues = data.trim().split(':');
    const now = new Date();
    now.setHours(timeValues[0]);
    now.setMinutes(timeValues[1]);
    now.setSeconds(timeValues[2]);

    return now;
  }

}
