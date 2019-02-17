import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from '../layout/main/main.component';
import { TerminalComponent } from '../shared/terminal/terminal.component';
import { TerminalDialogComponent } from '../shared/terminal-dialog/terminal-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'terminal', pathMatch: 'full' },
      { path: 'performance', loadChildren: './performance/performance.module#PerformanceModule' },
      { path: 'driver', loadChildren: './driver/driver.module#DriverModule' },
      { path: 'docker', loadChildren: './docker/docker.module#DockerModule' },
      { path: 'terminal', component: TerminalDialogComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutesRoutingModule { }
