import { Component, OnInit } from '@angular/core';
import { DockerService } from '../service/docker.service';
import { NGXLogger } from 'ngx-logger';
import { DockerImage } from './docker-image';
import { DockerExecutorService } from '../service/docker-executor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-docker-images',
  templateUrl: './docker-images.component.html',
  styleUrls: ['./docker-images.component.scss']
})
export class DockerImagesComponent implements OnInit {

  public images: Array<DockerImage> = [];

  constructor(private readonly dockerService: DockerService,
    private readonly logger: NGXLogger,
    private readonly dockerExecutorService: DockerExecutorService,
    private readonly router: Router) { }

  ngOnInit() {
    this.dockerService.getImages().subscribe(value => {
      this.images = value;
    });
  }

  public remove(index: number): void {
    // TODO:删除镜像
    this.logger.warn('remove image');
  }

  public in(index: number): void {
    this.dockerExecutorService.saveImage(this.images[index]);
    this.router.navigate(['docker/image-setting']);
  }
}
