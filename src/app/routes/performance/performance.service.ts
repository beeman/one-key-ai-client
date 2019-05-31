import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EnvironmentService } from 'src/app/core/environment.service';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  // private readonly messageLength = 60;

  // private message$: Subject<any> = new Subject();
  // private messages = [];

  constructor(
    // private readonly socketService: InfoSocketService,
    private readonly environmentService: EnvironmentService
  ) {
    // const message$ = this.socketService.getObservable('topInfo').pipe(
    //   map((value) => {
    //     const jsonValue = JSON.parse(value);
    //     jsonValue.top.time = this.parseTime(jsonValue.top.time);
    //     return jsonValue;
    //   }),
    // );

    // message$.subscribe(this.message$);

    // this.message$.subscribe((value) => {
    //   this.saveMessage(value);
    // });
  }

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

  // public getMessage(): Observable<any> {
  //   return this.message$;
  // }

  // public getMessages(): any[] {
  //   return this.messages;
  // }

  // private saveMessage(message: any): void {
  //   this.messages.push(message);
  //   if (this.messages.length > this.messageLength) {
  //     this.messages.shift();
  //   }
  // }

  // private parseTime(data: any): Date {
  //   const timeValues = data.trim().split(':');
  //   const now = new Date();
  //   now.setHours(timeValues[0]);
  //   now.setMinutes(timeValues[1]);
  //   now.setSeconds(timeValues[2]);

  //   return now;
  // }

}
