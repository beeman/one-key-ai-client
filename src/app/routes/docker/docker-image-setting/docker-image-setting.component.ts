import { Component, OnInit } from '@angular/core';
import { UploadFile, UploadXHRArgs } from 'ng-zorro-antd';
import { NGXLogger } from 'ngx-logger';
import { DockerExecutorService } from '../service/docker-executor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-docker-image-setting',
  templateUrl: './docker-image-setting.component.html',
  styleUrls: ['./docker-image-setting.component.scss']
})
export class DockerImageSettingComponent implements OnInit {

  public filePath = '~/文档/docker_project';
  public port: number = null;

  constructor(private readonly logger: NGXLogger,
    private readonly dockerExecutorService: DockerExecutorService,
    private readonly router: Router) { }

  ngOnInit() {
  }

  public beforeUpload(file: UploadFile): boolean {
    return false;
  }

  public customReq(item: UploadXHRArgs) {
    return null;
  }

  public confirm(): void {
    this.dockerExecutorService.savePath(this.filePath);
    this.dockerExecutorService.savePort(this.port);
    this.router.navigate(['docker/shell']);
  }
}
