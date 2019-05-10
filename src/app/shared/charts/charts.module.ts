import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockioComponent } from './blockio/blockio.component';
import { CpuComponent } from './cpu/cpu.component';
import { MemoryComponent } from './memory/memory.component';
import { NetworkComponent } from './network/network.component';
import { PidsComponent } from './pids/pids.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [CpuComponent, MemoryComponent, NetworkComponent, BlockioComponent, PidsComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule
  ],
  exports: [
    CpuComponent,
    MemoryComponent,
    NetworkComponent,
    BlockioComponent,
    PidsComponent
  ]
})
export class ChartsModule { }
