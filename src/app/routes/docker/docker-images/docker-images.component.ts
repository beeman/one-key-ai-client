import { Component, OnInit } from '@angular/core';
import { DockerService, MessageLevel } from '../service/docker.service';
import { NGXLogger } from 'ngx-logger';
import { DockerImage } from './docker-image';
import { DockerExecutorService } from '../service/docker-executor.service';
import { Router } from '@angular/router';
import { DockerImagesService } from '../service/docker-images.service';
import * as Docker from 'dockerode';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-docker-images',
  templateUrl: './docker-images.component.html',
  styleUrls: ['./docker-images.component.scss']
})
export class DockerImagesComponent implements OnInit {

  public images: Array<DockerImage> = [];

  constructor(
    private readonly dockerService: DockerService,
    private readonly logger: NGXLogger,
    private readonly dockerExecutorService: DockerExecutorService,
    private readonly router: Router,
    private readonly dockerImagesService: DockerImagesService,
    private readonly messageService: NzMessageService
  ) { }

  ngOnInit() {
    // this.dockerService.getImages().subscribe(value => {
    //   this.images = value;
    // });

    this.updateImages();
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
    // this.dockerExecutorService.saveImage(this.images[index]);
    // this.router.navigate(['docker/image-setting']);
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
        const size = Math.round(image.Size / 1000) / 1000 + 'MB';

        images.push({ repository: repository, tag: tag, id: id, created: createTime, size: size });
      });
      this.images = images;
    });
  }
}
