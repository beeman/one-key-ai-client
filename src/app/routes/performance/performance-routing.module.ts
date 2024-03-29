import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllComponent } from './all/all.component';
import { PerformanceMainComponent } from './performance-main/performance-main.component';
import { GpuComponent } from './gpu/gpu.component';

const routes: Routes = [
  {
    path: '',
    component: PerformanceMainComponent,
    children: [
      { path: '', redirectTo: 'all' },
      { path: 'all', component: AllComponent },
      // { path: 'cpu', component: CpuChartComponent },
      // { path: 'mem', component: MemoryChartComponent },
      { path: 'gpu', component: GpuComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceRoutingModule { }
