import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CpuChartComponent } from './cpu/cpu-chart/cpu-chart.component';
import { AllComponent } from './all/all.component';
import { PerformanceMainComponent } from './performance-main/performance-main.component';
import { MemoryChartComponent } from './memory/memory-chart/memory-chart.component';

const routes: Routes = [
  {
    path: '',
    component: PerformanceMainComponent,
    children: [
      { path: '', redirectTo: 'all' },
      { path: 'all', component: AllComponent },
      { path: 'cpu', component: CpuChartComponent },
      { path: 'mem', component: MemoryChartComponent },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceRoutingModule { }
