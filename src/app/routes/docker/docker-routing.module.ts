import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DockerImagesComponent } from './docker-images/docker-images.component';
import { ContainersComponent } from './containers/containers.component';
import { ContainerStatsComponent } from './container-stats/container-stats.component';
import { IdeComponent } from './ide/ide.component';
import { DockerShellGroupComponent } from './ide/docker-shell/docker-shell-group/docker-shell-group.component';

const routes: Routes = [
  { path: '', redirectTo: 'images', pathMatch: 'full' },
  { path: 'images', component: DockerImagesComponent },
  { path: 'containers', component: ContainersComponent },
  { path: 'container-stats', component: ContainerStatsComponent },
  { path: 'shell-group', component: DockerShellGroupComponent },
  { path: 'ide', component: IdeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DockerRoutingModule { }
