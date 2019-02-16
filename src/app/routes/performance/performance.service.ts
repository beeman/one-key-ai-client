import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { InfoSocketService } from 'src/app/core/info-socket.service';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private readonly messageLength = 60;

  private message$: Subject<any> = new Subject();
  private messages = [];

  constructor(private readonly socketService: InfoSocketService, private readonly logger: NGXLogger) {
    const message$ = this.socketService.getObservable('topInfo').pipe(
      map((value) => {
        const jsonValue = JSON.parse(value);
        jsonValue.top.time = this.parseTime(jsonValue.top.time);
        return jsonValue;
      }),
    );

    message$.subscribe(this.message$);

    this.message$.subscribe((value) => {
      this.saveMessage(value);
    });
  }

  public getMessage(): Observable<any> {
    return this.message$;
  }

  public getMessages(): any[] {
    return this.messages;
  }

  private saveMessage(message: any): void {
    this.messages.push(message);
    if (this.messages.length > this.messageLength) {
      this.messages.shift();
    }
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
