import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceRoutingModule } from './performance-routing.module';
import { CpuComponent } from './cpu/cpu.component';
import { AllComponent } from './all/all.component';
import { PerformanceMainComponent } from './performance-main/performance-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MemoryComponent } from './memory/memory.component';

@NgModule({
  declarations: [CpuComponent, AllComponent, PerformanceMainComponent, MemoryComponent],
  imports: [
    CommonModule,
    PerformanceRoutingModule,
    SharedModule
  ]
})
export class PerformanceModule { }
