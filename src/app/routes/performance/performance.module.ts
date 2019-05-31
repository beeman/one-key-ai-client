import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceRoutingModule } from './performance-routing.module';
import { AllComponent } from './all/all.component';
import { PerformanceMainComponent } from './performance-main/performance-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GpuComponent } from './gpu/gpu.component';

@NgModule({
  declarations: [AllComponent, PerformanceMainComponent, GpuComponent],
  imports: [
    CommonModule,
    PerformanceRoutingModule,
    SharedModule
  ]
})
export class PerformanceModule { }
