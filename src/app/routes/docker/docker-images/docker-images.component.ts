import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { DockerService, MessageLevel } from '../service/docker.service';
import { DockerImage } from './docker-image';
import { DockerImagesService } from '../service/docker-images.service';
import * as Docker from 'dockerode';
import { NzMessageService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { DockerimageShellComponent } from './dockerimage-shell/dockerimage-shell.component';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

interface ContainerInfo {
  id?: string;
  name?: string;
  isNvidia?: boolean;
}

@Component({
  selector: 'app-docker-images',
  templateUrl: './docker-images.component.html',
  styleUrls: ['./docker-images.component.scss']
})
export class DockerImagesComponent implements OnInit {
  @ViewChild('terminalElement')
  terminalElement: DockerimageShellComponent;

  @ViewChild('imageNameInput')
  imageNameInput: ElementRef;

  imageSuggestions: string[] = [];

  containerForm: FormGroup;
  images: Array<DockerImage> = [];
  containerDialogVisible: boolean = false;

  pullImageDialogVisible: boolean = false;
  imageName: string = '';
  imageVersion: string = '';
  pullImageShellVisible: boolean = false;

  private containerInfo: ContainerInfo = { isNvidia: false };

  constructor(
    private readonly dockerService: DockerService,
    private readonly dockerImagesService: DockerImagesService,
    private readonly messageService: NzMessageService,
    private readonly formBuilder: FormBuilder,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) { }

  ngOnInit() {
    this.updateImages();
    this.containerForm = this.formBuilder.group({
      name: [''],
      isNvidia: true
    });

    fromEvent(this.imageNameInput.nativeElement, 'input')
      .pipe(throttleTime(500))
      .subscribe(() => {
        this.dockerImagesService.searchImage(this.imageName).subscribe(data => {
          if (data['msg'] === 'ok') {
            const suggestions = [];
            const images = data['data'];
            if (!images) {
              return;
            }
            images.forEach((image: any) => {
              suggestions.push(image['name']);
            });
            this.imageSuggestions = suggestions;
          }
        });
      });
  }

  public remove(id: string): void {
    // TODO:删除镜像
    this.dockerImagesService.removeImage(id).subscribe(value => {
      const message = this.dockerService.showMessage(value, this.messageService);
      if (message.level === MessageLevel.Info) {
        this.updateImages();
      }
    });
  }

  public createContainer(image: DockerImage): void {
    this.containerDialogVisible = true;
    this.containerInfo.id = image.repoTags ? image.repoTags[0] : image.id;
  }

  public containerDialogCancel(): void {
    this.containerDialogVisible = false;
  }

  public containerDialogOk(): void {
    const userName = this.tokenService.get().userName;

    this.containerDialogVisible = false;
    this.containerInfo.name = userName + '--' + this.containerForm.get('name').value;
    this.containerInfo.isNvidia = this.containerForm.get('isNvidia').value;

    this.dockerImagesService.createContainer(this.containerInfo).subscribe((value: any) => {
      const message = this.dockerService.showMessage(value, this.messageService);
      // if (message.level === MessageLevel.Info) {
      //   this.dockerContainersService.saveData(value.containerId, userName).subscribe();
      // }
    });
  }

  public pullImage(): void {
    this.pullImageDialogVisible = true;
  }

  public pullImageDialogCancel(): void {
    this.pullImageDialogVisible = false;
  }

  public pullImageDialogOk(): void {
    if (!this.imageName) {
      this.messageService.warning('名称不能为空');
      return;
    }

    this.pullImageShellVisible = true;
    setTimeout(() => {
      const terminal = this.terminalElement.getTerminal();
      setTimeout(() => {
        const version = this.imageVersion ? this.imageVersion : 'latest';
        terminal.startPull(`${this.imageName}:${version}`);
        terminal.getState().on('end', () => {
          this.pullImageShellVisible = false;
          this.pullImageDialogVisible = false;
          this.updateImages();
        });
        terminal.getState().on('err', (data) => {
          this.messageService.warning(data);
        });
      }, 0);
    }, 0);

  }

  private updateImages(): void {
    this.dockerImagesService.getInfo().subscribe((imageInfos) => {

      const images = [];
      imageInfos.forEach((image: Docker.ImageInfo) => {
        let repository = '';
        let tag = '<none>';
        if (image.RepoTags) {
          const repoTags = image.RepoTags[0].split(':');
          repository = repoTags[0];
          tag = repoTags[1];
        } else if (image.RepoDigests) {
          repository = image.RepoDigests[0].split('@')[0];
        }
        const id = image.Id.split(':')[1].substr(0, 12);
        const createTime = new Date(image.Created * 1000).toLocaleString();
        const size = Math.round(image.Size / 1024) / 1024 + 'MB';

        images.push({ repository: repository, tag: tag, id: id, created: createTime, size: size, repoTags: image.RepoTags });
      });
      this.images = images;
    });
  }
}
