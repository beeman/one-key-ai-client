import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from '../layout/main/main.component';
import { AuthComponent } from '../layout/auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { SimpleGuard } from '@delon/auth';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [SimpleGuard],
    children: [
      { path: '', redirectTo: 'docker', pathMatch: 'full' },
      { path: 'performance', loadChildren: './performance/performance.module#PerformanceModule' },
      { path: 'driver', loadChildren: './driver/driver.module#DriverModule' },
      { path: 'docker', loadChildren: './docker/docker.module#DockerModule' },
      { path: 'user', loadChildren: './user/user.module#UserModule' },
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class RoutesRoutingModule { }
