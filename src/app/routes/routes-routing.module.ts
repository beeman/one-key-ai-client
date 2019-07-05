import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from '../layout/main/main.component';
import { AuthComponent } from '../layout/auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { SimpleGuard } from '@delon/auth';
import { IntroductionComponent } from './introduction/introduction.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [SimpleGuard],
    children: [
      { path: '', redirectTo: 'introduction', pathMatch: 'full' },
      { path: 'introduction', component: IntroductionComponent },
      { path: 'performance', loadChildren: () => import('./performance/performance.module').then(m => m.PerformanceModule) },
      { path: 'driver', loadChildren: () => import('./driver/driver.module').then(m => m.DriverModule) },
      { path: 'docker', loadChildren: () => import('./docker/docker.module').then(m => m.DockerModule) },
      { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
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
