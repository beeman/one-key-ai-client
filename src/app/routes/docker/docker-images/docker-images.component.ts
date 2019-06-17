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
import { DockerImageShell } from './dockerimage-shell/docker-image-shell';
import { UserService } from 'src/app/core/user.service';

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

  terminal: DockerImageShell = null;

  imageSuggestions: string[] = [];

  containerForm: FormGroup;
  images: Array<DockerImage> = [];
  containerDialogVisible: boolean = false;

  pullImageDialogVisible: boolean = false;
  imageName: string = '';
  imageVersion: string = '';
  pullImageShellVisible: boolean = false;

  isAdmin: boolean = false;

  private containerInfo: ContainerInfo = { isNvidia: false };

  constructor(
    private readonly dockerService: DockerService,
    private readonly dockerImagesService: DockerImagesService,
    private readonly messageService: NzMessageService,
    private readonly formBuilder: FormBuilder,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private readonly userService: UserService
  ) { }

  ngOnInit() {
    this.userService.checkAdmin(this.tokenService.get()['userName']).subscribe(value => {
      this.isAdmin = <boolean>value;
    });
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
    this.containerInfo.name = image.repository;
  }

  public containerDialogCancel(): void {
    this.containerDialogVisible = false;
  }

  public containerDialogOk(): void {
    const userName = this.tokenService.get().userName;

    this.containerDialogVisible = false;
    const name = this.containerForm.get('name').value ? this.containerForm.get('name').value : this.containerInfo.name;
    this.containerInfo.name = userName + '--' + name;
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
    if (this.terminal) {
      this.terminal.stopPull();
    }
    this.pullImageDialogVisible = false;
  }

  public pullImageDialogOk(): void {
    if (!this.imageName) {
      this.messageService.warning('名称不能为空');
      return;
    }

    this.pullImageShellVisible = true;
    setTimeout(() => {
      this.terminal = this.terminalElement.getTerminal();
      setTimeout(() => {
        const version = this.imageVersion ? this.imageVersion : 'latest';
        this.terminal.startPull(`${this.imageName}:${version}`);
        this.terminal.getState().on('end', () => {
          this.pullImageShellVisible = false;
          this.pullImageDialogVisible = false;
          this.updateImages();
        });
        this.terminal.getState().on('err', (data) => {
          this.messageService.warning(data);
        });
      }, 0);
    }, 0);

  }

  public updateImages(): void {
    this.dockerImagesService.getInfo().subscribe((imageInfos) => {
      if (!imageInfos) {
        return;
      }

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
