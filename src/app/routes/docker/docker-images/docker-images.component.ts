import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { DockerService, MessageLevel } from '../service/docker.service';
import { DockerImage } from './docker-image';
import { DockerImagesService } from '../service/docker-images.service';
import * as Docker from 'dockerode';
import { NzMessageService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
  ports?: number[];
}

interface PortInfo {
  id: number;
  port: number;
  controlName: string;
}

@Component({
  selector: 'app-docker-images',
  templateUrl: './docker-images.component.html',
  styleUrls: ['./docker-images.component.scss']
})
export class DockerImagesComponent implements OnInit {
  @ViewChild('terminalElement', { static: false })
  terminalElement: DockerimageShellComponent;

  @ViewChild('imageNameInput', { static: false })
  imageNameInput: ElementRef;

  terminal: DockerImageShell = null;  // 拉取镜像的终端

  imageSuggestions: string[] = [];  // 镜像自动提示列表
  images: Array<DockerImage> = [];  // 镜像列表

  containerForm: FormGroup; // 容器表格
  containerDialogVisible: boolean = false;  // 创建容器对话框可见性

  imageName: string = ''; // 拉取镜像名
  imageVersion: string = '';  // 拉取镜像版本
  pullImageShellVisible: boolean = false; // 拉取镜像终端的可见性
  pullImageDialogVisible: boolean = false;  // 拉取镜像对话框的可见性

  isAdmin: boolean = false; // 是否为管理员
  defaultContainerName = "";  // 默认容器名

  isCreatingContainer: boolean = false; //是否正在创建容器

  portList: Array<PortInfo> = [{ id: 0, port: 8000, controlName: `port0` }];  // 开放的端口列表

  private containerInfo: ContainerInfo = { isNvidia: true, ports: [] };

  constructor(
    private readonly dockerService: DockerService,
    private readonly dockerImagesService: DockerImagesService,
    private readonly messageService: NzMessageService,
    private readonly formBuilder: FormBuilder,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private readonly userService: UserService
  ) { }

  ngOnInit() {
    this.userService.checkAdmin().subscribe(value => {
      this.isAdmin = <boolean>value;
    });
    this.updateImages();
    this.containerForm = this.formBuilder.group({
      name: [''],
      isNvidia: true
    });
    this.portList.forEach((value) => {
      this.containerForm.addControl(value.controlName, new FormControl(value.port, Validators.required));
    });


  }

  ngAfterViewInit(): void {
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

  public addPort(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    const id = this.portList.length > 0 ? this.portList[this.portList.length - 1].id + 1 : 0;
    const control = { id: id, port: null, controlName: `port${id}` };
    this.portList.push(control);
    this.containerForm.addControl(control.controlName, new FormControl(control.port, Validators.required));
  }

  public removePort(control: PortInfo, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }

    if (this.portList.length > 0) {
      const index = this.portList.indexOf(control);
      this.portList.splice(index, 1);
      this.containerForm.removeControl(control.controlName);
    }
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
    const names = image.repository.split('/');
    this.containerInfo.name = names[names.length - 1];
    this.defaultContainerName = names[names.length - 1];
  }

  public containerDialogCancel(): void {
    this.containerDialogVisible = false;
  }

  public containerDialogOk(): void {
    for (const i in this.containerForm.controls) {
      this.containerForm.controls[i].markAsDirty();
      this.containerForm.controls[i].updateValueAndValidity();
    }
    if (!this.containerForm.valid) {
      return;
    }

    // 记录端口
    this.containerInfo.ports = [];
    this.portList.forEach(value => {
      this.containerInfo.ports.push(this.containerForm.get(value.controlName).value);
    });

    const userName = this.tokenService.get().userName;

    this.containerDialogVisible = false;
    const name = this.containerForm.get('name').value ? this.containerForm.get('name').value : this.containerInfo.name;
    this.containerInfo.name = userName + '--' + name;
    this.containerInfo.isNvidia = this.containerForm.get('isNvidia').value;

    this.isCreatingContainer = true;
    this.dockerImagesService.createContainer(this.containerInfo).subscribe((value: any) => {
      this.isCreatingContainer = false;
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
    this.dockerImagesService.getInfo().subscribe((data) => {
      if (data['msg'] !== 'ok') {
        console.error(data['data']);
        return;
      }

      const imageInfos = data['data'];
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
