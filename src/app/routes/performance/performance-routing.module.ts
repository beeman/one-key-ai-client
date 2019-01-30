import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CpuComponent } from './cpu/cpu.component';
import { AllComponent } from './all/all.component';
import { PerformanceMainComponent } from './performance-main/performance-main.component';

const routes: Routes = [
  {
    path: '',
    component: PerformanceMainComponent,
    children: [
      { path: '', redirectTo: 'all'},
      { path: 'all', component: AllComponent },
      { path: 'cpu', component: CpuComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceRoutingModule { }
