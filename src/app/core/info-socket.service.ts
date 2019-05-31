import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

import * as io from 'socket.io-client';
import { NGXLogger } from 'ngx-logger';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfoSocketService {
  private socket: SocketIOClient.Socket = null;

  constructor(private readonly logger: NGXLogger) {
    this.openSocket();
  }

  // public emit(event: string, ...args: any[]) {
  //   return this.socket.emit(event, ...args);
  // }

  /**
   * 申请获取数据并返回为Observable
   * 数据获取完毕后，发送complete信号，自动结束订阅
   *
   * @param key 目标数据标志
   * @returns 可订阅对象
   */
  public getRepObservable(key: string, ...args: any[]): Observable<any> {
    this.socket.emit(key, ...args);

    return this.getObservable(key, args);
  }

  public getObservable(key: string, ...args: any[]): Observable<any> {
    return new Observable(observer => {
      const fn = value => {
        if (value.type === 'stdout') {
          observer.next(value.value);
        } else if (value.type === 'not exist') {
          observer.error(`not exist command: ${value.value}\nplease try to install ${value.value}`);
        } else if (value.type === 'stderr') {
          observer.error(value.value);
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
    const serverAddr = environment.serverUrl.substr(0, environment.serverUrl.lastIndexOf(':'));
    this.socket = io.connect(serverAddr + ':3001');
  }
}
