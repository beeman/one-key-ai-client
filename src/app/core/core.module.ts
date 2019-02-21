import { NgModule, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoggerModule.forRoot({ level: environment.logLevel })
  ],
})
export class CoreModule { }
