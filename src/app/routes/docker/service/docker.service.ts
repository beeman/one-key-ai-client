import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InfoSocketService } from 'src/app/core/info-socket.service';
import { NGXLogger } from 'ngx-logger';
import { first } from 'rxjs/operators';
import { DockerImage } from '../docker-images/docker-image';
import { NzMessageService } from 'ng-zorro-antd';


export enum MessageLevel {
  Info,
  Warning,
  Error
}

export interface DockerMessage {
  level: MessageLevel;
  message: string;
  reason?: string;
  json?: string;
}
@Injectable({
  providedIn: 'root'
})
export class DockerService {

  constructor() { }


  public showMessage(data: any, messageService: NzMessageService): DockerMessage {
    const message = this.parseData(data);
    switch (message.level) {
      case MessageLevel.Info: messageService.info(message.message ? message.message : 'done'); break;
      case MessageLevel.Warning: messageService.warning(message.message); break;
      case MessageLevel.Error: messageService.error(message.message); break;
      default: break;
    }

    return message;
  }

  private parseData(data: any): DockerMessage {
    const statusCode = data['statusCode'] ? data['statusCode'] : data;
    let level = MessageLevel.Info;
    switch (statusCode) {
      case 200:
      case 204: level = MessageLevel.Info; break;
      case 304: level = MessageLevel.Warning; break;
      case 400:
      case 404:
      case 409:
      case 500: level = MessageLevel.Error; break;
      default: level = MessageLevel.Info; break;
    }

    let message = '';
    if (data['json'] && data['json']['message']) {
      message = data['json']['message'];
    } else if (data['reason']) {
      message = data['reason'];
    }

    return { level: level, message: message };
  }

}
