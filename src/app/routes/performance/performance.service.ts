import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EnvironmentService } from 'src/app/core/environment.service';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  constructor(
    private readonly environmentService: EnvironmentService
  ) { }

  public getStats(): Observable<any> {
    return new Observable(observer => {
      const socket = io(this.environmentService.serverUrl());
      socket.on('connect', () => {
        socket.on('data', (data) => {
          observer.next(data);
        });
        socket.emit('computerStats');
      });
      socket.on('disconnect', () => {
        observer.complete();
      });

      return {
        unsubscribe: () => {
          socket.disconnect();
        }
      };
    });
  }

}
