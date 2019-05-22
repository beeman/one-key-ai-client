import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DockerRoutingModule } from './docker-routing.module';
import { DockerImagesComponent } from './docker-images/docker-images.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DockerShellComponent } from './docker-shell/docker-shell.component';
import { ContainersComponent } from './containers/containers.component';
import { ContainerStatsComponent } from './container-stats/container-stats.component';
import { FileListComponent } from './file-list/file-list.component';

@NgModule({
  declarations: [
    DockerImagesComponent,
    DockerShellComponent,
    ContainersComponent,
    ContainerStatsComponent,
    FileListComponent],
  imports: [
    CommonModule,
    DockerRoutingModule,
    SharedModule
  ]
})
export class DockerModule { }
