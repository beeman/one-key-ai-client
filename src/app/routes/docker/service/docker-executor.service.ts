import { Injectable } from '@angular/core';
import { DockerImage } from '../docker-images/docker-image';
import { NGXLogger } from 'ngx-logger';
import { InfoSocketService } from 'src/app/core/info-socket.service';

class DockerParamas {
  dockerImage: DockerImage; // 镜像信息
  sourcePath: string; // 源路径
  sourcePort: number; // 源端口
  distPath: string; // 目标路径
  distPort: number; // 目标端口
}

@Injectable({
  providedIn: 'root'
})
export class DockerExecutorService {

  private dockerToRun: DockerParamas = new DockerParamas();

  constructor(private readonly logger: NGXLogger, private readonly socketService: InfoSocketService) { }

  public saveImage(image: DockerImage): void {
    this.dockerToRun.dockerImage = image;
  }

  public savePath(path: string): void {
    this.dockerToRun.sourcePath = path;
    this.dockerToRun.distPath = '/home/' + path.split('/').pop();
  }

  public savePort(port: number): void {
    this.dockerToRun.sourcePort = port;
    this.dockerToRun.distPort = port; // 目标端口与源端口相同
  }

  public run(): void {
    // TODO: run
    this.socketService.getObservable('runDocker', `${this.dockerToRun.dockerImage.image_id}`)
      .subscribe(value => {
        this.logger.log(value);
      }, null, () => {
        this.logger.log('shell complete');
      });
  }

}
