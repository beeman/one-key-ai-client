import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InfoSocketService } from 'src/app/core/info-socket.service';
import { NGXLogger } from 'ngx-logger';
import { first } from 'rxjs/operators';
import { DockerImage } from '../docker-images/docker-image';

@Injectable({
  providedIn: 'root'
})
export class DockerService {

  constructor(private readonly socketService: InfoSocketService, private readonly logger: NGXLogger) { }

  public getImages(): Observable<any> {
    let text = '';
    return new Observable(observer => {
      this.socketService.getObservable('dockerImages').subscribe(value => {
        text += value;
      }, null, () => {
        const lines: string[] = text.trim().split('\n');
        lines.unshift();
        observer.next(this.parseImagesInfoLines(lines));
      });
    }).pipe(
      first()
    );
  }


  private parseImagesInfoLines(lines: string[]): any {
    const result: DockerImage[] = [];
    lines.forEach((line: string, index: number) => {
      if (index > 0) {
        const values = line.trim().split(new RegExp('\\s+'));
        let createdText = values[3];
        values.forEach((value: string, index: number) => {
          if (index > 3 && index < values.length - 1) {
            createdText += ' ' + value;
          }
        });
        const image: DockerImage = { repository: values[0], tag: values[1], image_id: values[2], created: createdText, size: values[values.length - 1] };
        result.push(image)
      }
    })
    return result;
  }
}
