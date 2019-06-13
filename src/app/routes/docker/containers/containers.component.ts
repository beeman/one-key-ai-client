import { Component, OnInit, Inject } from '@angular/core';
import { DockerContainersService } from '../service/docker-containers.service';
import { DockerContainer } from './docker-container';
import { DockerService, MessageLevel, DockerMessage } from '../service/docker.service';
import { NzMessageService, UploadChangeParam, UploadXHRArgs, UploadFile } from 'ng-zorro-antd';
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
  public containers: DockerContainer[] = [];
  public newName = '';
  
  private containerId = '';

  // private fileList;

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

  public beforeUpload = (file: UploadFile, fileList: UploadFile[]): boolean => {
    // if (!this.fileList) {
    //   this.fileList = fileList;
    //   fileList.forEach(value => {
    //     const formData = new FormData();
    //     formData.append('file', value as any);
    //     formData.append('webkitRelativePath', value.webkitRelativePath);
    //     formData.append('userName', this.tokenService.get().userName);
    //     this.fileService.uploadFile(formData).subscribe(value => {
    //       console.log(value);
    //     });
    //   });
    // }

    return true;
  }

  public exec(id: string): void {
    this.router.navigate(['/docker/ide', { id: id }])
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

  public uploadReq = (item: UploadXHRArgs) => {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    formData.append(item.name, item.file as any);
    formData.append('webkitRelativePath', item.file.webkitRelativePath);
    formData.append('userName', this.tokenService.get().userName);
    // const req = new HttpRequest('POST', item.action!, formData, {
    //   reportProgress: true,
    //   withCredentials: true,
    // });

    return this.fileService.uploadFile(formData).subscribe(
      value => {
        if (value['msg'] !== 'ok') {
          item.onError!(value['data'], item.file!);
          console.error(value['data']);
        } else {
          item.onSuccess!(value['data'], item.file!, value);
        }
      },
      err => {
        // 处理失败
        console.error(err);
        item.onError!(err, item.file!);
      }
    );
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
