import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { EnvironmentService } from './environment.service';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceStatsService {
  private socket: SocketIOClient.Socket;
  private statsSubject: Subject<string> = new Subject<string>();

  constructor(
    private readonly environmentService: EnvironmentService
  ) {
    this.socket = io.connect(this.environmentService.serverUrl());
    this.socket.emit('nvidiaStats');
    this.socket.on('data', (data) => {
      this.statsSubject.next(data);
      // console.log(data);
    });
    this.socket.on('err', (err) => {
      // console.error(err);
    });
  }

  public getStats(): Observable<string> {
    return this.statsSubject;
  }
}
