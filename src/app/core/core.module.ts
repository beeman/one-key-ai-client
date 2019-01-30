import { NgModule, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

// 日志配置
let logConfig = null;
if (isDevMode()) {
  logConfig = { level: NgxLoggerLevel.DEBUG };
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoggerModule.forRoot(logConfig)
  ],
})
export class CoreModule { }
