import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DockerRoutingModule } from './docker-routing.module';
import { DockerImagesComponent } from './docker-images/docker-images.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DockerImageSettingComponent } from './docker-image-setting/docker-image-setting.component';
import { DockerShellComponent } from './docker-shell/docker-shell.component';

@NgModule({
  declarations: [DockerImagesComponent, DockerImageSettingComponent, DockerShellComponent],
  imports: [
    CommonModule,
    DockerRoutingModule,
    SharedModule
  ]
})
export class DockerModule { }
