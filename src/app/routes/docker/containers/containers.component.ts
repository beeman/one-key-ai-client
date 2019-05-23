import { Component, OnInit, Inject } from '@angular/core';
import { DockerContainersService } from '../service/docker-containers.service';
import { DockerContainer } from './docker-container';
import { DockerService, MessageLevel, DockerMessage } from '../service/docker.service';
import { NzMessageService, UploadChangeParam } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { FileService } from '../service/file.service';

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements OnInit {
  renameDialogVisible = false;

  public uploading = false;
  public currentUploadingFile: string;

  private containers: DockerContainer[] = [];
  private containerId = '';
  private newName = '';

  constructor(
    private readonly containersService: DockerContainersService,
    private readonly dockerService: DockerService,
    private readonly messageService: NzMessageService,
    private readonly router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    public fileService: FileService
  ) {
  }

  ngOnInit() {
    this.updateContainers();
  }

  public exec(id: string): void {
    this.router.navigate(['/docker/shell', { id: id }])
  }

  public stop(id: string): void {
    this.containersService.stop(id).subscribe(value => {
      this.onData(value);
    });
  }

  public kill(id: string): void {
    this.containersService.kill(id).subscribe(value => {
      this.onData(value);
    });
  }

  public start(id: string): void {
    this.containersService.start(id).subscribe(value => {
      this.onData(value);
    });
  }

  public stats(id: string): void {
    this.router.navigate(['/docker/container-stats', { id: id }])
  }

  public restart(id: string): void {
    this.containersService.restart(id).subscribe(value => {
      this.onData(value);
    });
  }

  public remove(id: string): void {
    this.containersService.remove(id).subscribe(value => {
      const message = this.onData(value);
      // if (message.level === MessageLevel.Info) {
      //   this.containersService.removeData(id, this.tokenService.get().userName).subscribe();
      // }
    });
  }

  public rename(id: string): void {
    this.renameDialogVisible = true;
    this.containerId = id;
  }

  public renameCancel(): void {
    this.renameDialogVisible = false;
  }

  public renameOk(): void {
    this.renameDialogVisible = false;
    this.containersService.rename(this.containerId, this.newName).subscribe(value => {
      this.onData(value);
    });
  }

  public uploadChange(event: UploadChangeParam) {
    this.uploading = true;
    this.currentUploadingFile = event.file.name;

    if (event.file.status === 'done') {
      let done = true;
      for (let i = 0; i < event.fileList.length; ++i) {
        const file = event.fileList[i];
        if (file.status !== 'done') {
          done = false;
          break;
        }
      }
      if (done) {
        this.uploading = false;
        this.currentUploadingFile = '上传完成';
      }
    }
  }

  private onData(data: any): DockerMessage {
    const message = this.dockerService.showMessage(data, this.messageService);
    if (message.level === MessageLevel.Info) {
      this.updateContainers();
    }

    return message;
  }

  private updateContainers(): void {
    const userName = this.tokenService.get().userName;

    const containerInfos: DockerContainer[] = [];
    this.containersService.getInfo(userName).subscribe((containers) => {
      containers.forEach((container) => {
        const portInfos: string[] = [];
        container.Ports.forEach((port) => {
          if (port.IP === '0.0.0.0') {
            portInfos.push(`${port.PublicPort}->${port.PrivatePort}/${port.Type}`);
          } else {
            portInfos.push(`${port.IP}:${port.PublicPort}->${port.PrivatePort}/${port.Type}`);
          }
        });
        let sizeRootFs = '';
        if (container['SizeRootFs']) {
          sizeRootFs = Math.round(container['SizeRootFs'] / 1024) / 1024 + 'MB';
        }

        containerInfos.push({
          id: container.Id,
          image: container.Image,
          command: container.Command,
          created: new Date(container.Created * 1000).toLocaleString(),
          state: container.State,
          status: container.Status,
          ports: portInfos,
          names: container.Names,
          sizeRootFs: sizeRootFs
        });
      });
      this.containers = containerInfos;
    });
  }
}
