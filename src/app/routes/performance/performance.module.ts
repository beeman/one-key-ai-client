import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceRoutingModule } from './performance-routing.module';
import { CpuChartComponent } from './cpu/cpu-chart/cpu-chart.component';
import { AllComponent } from './all/all.component';
import { PerformanceMainComponent } from './performance-main/performance-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MemoryChartComponent } from './memory/memory-chart/memory-chart.component';
import { CpuInfoComponent } from './cpu/cpu-info/cpu-info.component';
import { MemoryInfoComponent } from './memory/memory-info/memory-info.component';

@NgModule({
  declarations: [CpuChartComponent, AllComponent, PerformanceMainComponent, MemoryChartComponent, CpuInfoComponent, MemoryInfoComponent],
  imports: [
    CommonModule,
    PerformanceRoutingModule,
    SharedModule
  ]
})
export class PerformanceModule { }
