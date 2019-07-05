import { Component, OnInit } from '@angular/core';
import { DockerContainersService } from '../service/docker-containers.service';
import { DockerContainer } from './docker-container';
import { DockerService, MessageLevel, DockerMessage } from '../service/docker.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { UserService } from '../../../core/user.service';

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements OnInit {
  renameDialogVisible = false;

  public containers: DockerContainer[] = [];
  public newName = '';
  public startContainerId = '';  // 正在启动容器的容器id
  public stopContainerId = ''; // 正在停止容器的容器id

  private renameContainerId = '';
  // private fileList;

  constructor(
    private readonly containersService: DockerContainersService,
    private readonly dockerService: DockerService,
    private readonly messageService: NzMessageService,
    private readonly router: Router,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.updateContainers();
  }

  public exec(id: string): void {
    this.router.navigate(['/docker/ide', { id: id }]);
  }

  public stop(id: string): void {
    this.stopContainerId = id;
    this.containersService.stop(id).subscribe(value => {
      this.stopContainerId = '';
      this.onData(value);
    });
  }

  public kill(id: string): void {
    this.containersService.kill(id).subscribe(value => {
      this.onData(value);
    });
  }

  public start(id: string): void {
    this.startContainerId = id;
    this.containersService.start(id).subscribe(value => {
      this.startContainerId = '';
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
    this.renameContainerId = id;
  }

  public renameCancel(): void {
    this.renameDialogVisible = false;
  }

  public renameOk(): void {
    this.renameDialogVisible = false;
    this.containersService.rename(this.renameContainerId, this.newName, this.userService.userName()).subscribe(value => {
      this.onData(value);
    });
  }

  public updateContainers(): void {
    const userName = this.userService.userName();

    const containerInfos: DockerContainer[] = [];
    this.containersService.getInfo(userName).subscribe((data) => {
      if (data['msg'] !== 'ok') {
        console.error(data['data']);
        return;
      }

      const containers = data['data'];
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
      containerInfos.sort((a, b) => {
        return a.names >= b.names ? 1 : -1;
      })
      this.containers = containerInfos;
    });
  }

  private onData(data: any): DockerMessage {
    const message = this.dockerService.showMessage(data, this.messageService);
    if (message.level === MessageLevel.Info) {
      this.updateContainers();
    }

    return message;
  }

}
