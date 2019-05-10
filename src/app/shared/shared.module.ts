import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TerminalComponent } from './terminal/terminal.component';
import { TerminalDialogComponent } from './terminal-dialog/terminal-dialog.component';
import { ChartsModule } from './charts/charts.module';

@NgModule({
  declarations: [TerminalComponent, TerminalDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgZorroAntdModule,
    ChartsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgZorroAntdModule,
    ChartsModule,
    TerminalComponent,
  ],
})
export class SharedModule { }
