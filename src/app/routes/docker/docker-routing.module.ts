import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DockerImagesComponent } from './docker-images/docker-images.component';
import { DockerShellComponent } from './docker-shell/docker-shell.component';
import { ContainersComponent } from './containers/containers.component';
import { ContainerStatsComponent } from './container-stats/container-stats.component';
import { FileBrowserComponent } from './file-browser/file-browser.component';

const routes: Routes = [
  { path: '', redirectTo: 'images', pathMatch: 'full' },
  { path: 'images', component: DockerImagesComponent },
  { path: 'containers', component: ContainersComponent },
  { path: 'container-stats', component: ContainerStatsComponent },
  { path: 'shell', component: DockerShellComponent },
  { path: 'file', component: FileBrowserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DockerRoutingModule { }
