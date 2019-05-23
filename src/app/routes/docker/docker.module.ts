import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DockerRoutingModule } from './docker-routing.module';
import { DockerImagesComponent } from './docker-images/docker-images.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DockerShellComponent } from './docker-shell/docker-shell.component';
import { ContainersComponent } from './containers/containers.component';
import { ContainerStatsComponent } from './container-stats/container-stats.component';
import { FileBrowserComponent } from './ide/file-browser/file-browser.component';
import { IdeComponent } from './ide/ide.component';

@NgModule({
  declarations: [
    DockerImagesComponent,
    DockerShellComponent,
    ContainersComponent,
    ContainerStatsComponent,
    FileBrowserComponent,
    IdeComponent,
  ],
  imports: [
    CommonModule,
    DockerRoutingModule,
    SharedModule
  ],
  exports: [
    DockerShellComponent
  ]
})
export class DockerModule { }
