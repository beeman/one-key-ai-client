import { Component, OnInit } from '@angular/core';
import { DockerService, MessageLevel } from '../service/docker.service';
import { DockerImage } from './docker-image';
import { DockerImagesService } from '../service/docker-images.service';
import * as Docker from 'dockerode';
import { NzMessageService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  containerForm: FormGroup;
  images: Array<DockerImage> = [];
  containerDialogVisible: boolean = false;

  private containerInfo: ContainerInfo = { isNvidia: false };

  constructor(
    private readonly dockerService: DockerService,
    private readonly dockerImagesService: DockerImagesService,
    private readonly messageService: NzMessageService,
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.updateImages();
    this.containerForm = this.formBuilder.group({
      name: [''],
      isNvidia: ['false']
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

  public createContainer(id: string): void {
    this.containerDialogVisible = true;
    this.containerInfo.id = id;
  }

  public containerDialogCancel(): void {
    this.containerDialogVisible = false;
  }

  public containerDialogOk(): void {
    this.containerDialogVisible = false;
    this.containerInfo.name = this.containerForm.get('name').value;
    this.containerInfo.isNvidia = this.containerForm.get('isNvidia').value;
    console.log(this.containerInfo);

    this.dockerImagesService.createContainer(this.containerInfo).subscribe(value => {
      this.dockerService.showMessage(value, this.messageService);
    });
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
