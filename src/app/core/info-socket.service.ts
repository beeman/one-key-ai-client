import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

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

  public emit(event: string, ...args: any[]) {
    return this.socket.emit(event, ...args);
  }

  // public getObservable(key: string): Observable<any> {
  //   return new Observable(observer => {
  //     this.socket.emit(key, null, (value) => {
  //       if (value.type !== 'exit') {
  //         observer.next(value.message);
  //       }
  //       if (value.type !== 'stdout') {
  //         observer.complete();
  //       }
  //     });
  //   });
  // }

  /**
   * 获取数据并转换为Observable
   * 数据获取完毕后，发送complete信号，自动结束订阅
   *
   * @param {string} key
   * @returns {Observable<any>}
   * @memberof InfoSocketService
   */
  public getObservable(key: string, ...args: any[]): Observable<any> {
    return new Observable(observer => {
      this.socket.emit(key, ...args);
      const fn = value => {
        if (value.type === 'stdout') {
          observer.next(value.message);
        }
        if (value.type !== 'stdout') {
          observer.complete();
          this.socket.off(key, fn);
        }
      };
      this.socket.on(key, fn);
    });
  }

  public getSocket(): SocketIOClient.Socket {
    return this.socket;
  }

  public getMessageEvent(messageName: string): Observable<any> {
    return fromEvent<string>(this.socket, messageName);
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
