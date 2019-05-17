import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './auth/auth.component';

@NgModule({
  declarations: [MainComponent, AuthComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class LayoutModule { }
