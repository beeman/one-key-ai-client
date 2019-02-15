import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DockerImagesComponent } from './docker-images/docker-images.component';
import { DockerImageSettingComponent } from './docker-image-setting/docker-image-setting.component';
import { DockerShellComponent } from './docker-shell/docker-shell.component';

const routes: Routes = [
  { path: '', redirectTo: 'images', pathMatch: 'full' },
  { path: 'images', component: DockerImagesComponent },
  { path: 'image-setting', component: DockerImageSettingComponent },
  { path: 'shell', component: DockerShellComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DockerRoutingModule { }
