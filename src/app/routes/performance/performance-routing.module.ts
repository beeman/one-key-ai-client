import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CpuComponent } from './cpu/cpu.component';
import { AllComponent } from './all/all.component';
import { PerformanceMainComponent } from './performance-main/performance-main.component';
import { MemoryComponent } from './memory/memory.component';

const routes: Routes = [
  {
    path: '',
    component: PerformanceMainComponent,
    children: [
      { path: '', redirectTo: 'all' },
      { path: 'all', component: AllComponent },
      { path: 'cpu', component: CpuComponent },
      { path: 'mem', component: MemoryComponent },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceRoutingModule { }
