import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverRoutingModule } from './driver-routing.module';
import { GpuComponent } from './gpu/gpu.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [GpuComponent],
  imports: [
    CommonModule,
    DriverRoutingModule,
    SharedModule
  ]
})
export class DriverModule { }
