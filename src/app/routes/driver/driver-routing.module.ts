import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GpuComponent } from './gpu/gpu.component';

const routes: Routes = [
  { path: '', redirectTo: 'gpu', pathMatch: 'full' },
  { path: 'gpu', component: GpuComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
