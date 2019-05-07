import { Component, OnInit } from '@angular/core';
import { DockerContainersService } from '../service/docker-containers.service';
import { DockerContainer } from './docker-container';
import { DockerService, MessageLevel, DockerMessage } from '../service/docker.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html',
  styleUrls: ['./containers.component.scss']
})
export class ContainersComponent implements OnInit {
  private containers: DockerContainer[] = [];

  constructor(
    private readonly containersService: DockerContainersService,
    private readonly dockerService: DockerService,
    private readonly messageService: NzMessageService) { }

  ngOnInit() {
    this.updateContainers();
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

  public restart(id: string): void {
    this.containersService.restart(id).subscribe(value => {
      this.onData(value);
    });
  }

  public remove(id: string): void {
    this.containersService.remove(id).subscribe(value => {
      this.onData(value);
    });
  }

  private onData(data: any): void {
    const message = this.dockerService.showMessage(data, this.messageService);
    if (message.level === MessageLevel.Info) {
      this.updateContainers();
    }
  }

  private updateContainers(): void {
    const containerInfos: DockerContainer[] = [];
    this.containersService.getInfo().subscribe((containers) => {
      containers.forEach((container) => {
        const portInfos: string[] = [];
        container.Ports.forEach((port) => {
          portInfos.push(`${port.IP}+${port.PublicPort}->${port.PrivatePort}/${port.Type}`);
        });
        let sizeRootFs = '';
        if (container['SizeRootFs']) {
          sizeRootFs = Math.round(container['SizeRootFs'] / 1000) / 1000 + 'MB';
        }

        containerInfos.push({
          id: container.Id.substr(0, 12),
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
