import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DockerRoutingModule } from './docker-routing.module';
import { DockerImagesComponent } from './docker-images/docker-images.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DockerShellComponent } from './ide/docker-shell/docker-shell.component';
import { ContainersComponent } from './containers/containers.component';
import { ContainerStatsComponent } from './container-stats/container-stats.component';
import { FileBrowserComponent } from './ide/file-browser/file-browser.component';
import { IdeComponent } from './ide/ide.component';
import { EditorComponent } from './ide/editor/editor.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { DockerShellGroupComponent } from './ide/docker-shell/docker-shell-group/docker-shell-group.component';
import { DockerimageShellComponent } from './docker-images/dockerimage-shell/dockerimage-shell.component';
import { EditorGroupComponent } from './ide/editor/editor-group/editor-group.component';
import { IntroductionComponent } from './ide/introduction/introduction.component';


@NgModule({
  declarations: [
    DockerImagesComponent,
    DockerShellComponent,
    ContainersComponent,
    ContainerStatsComponent,
    FileBrowserComponent,
    IdeComponent,
    EditorComponent,
    DockerShellGroupComponent,
    DockerimageShellComponent,
    EditorGroupComponent,
    IntroductionComponent,
  ],
  imports: [
    CommonModule,
    DockerRoutingModule,
    SharedModule,
    MonacoEditorModule.forRoot()
  ],
  exports: [
    DockerShellComponent
  ]
})
export class DockerModule { }
