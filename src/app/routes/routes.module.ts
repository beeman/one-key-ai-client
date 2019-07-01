import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutesRoutingModule } from './routes-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { IntroductionComponent } from './introduction/introduction.component';

@NgModule({
  declarations: [IntroductionComponent],
  imports: [
    CommonModule,
    SharedModule,
    RoutesRoutingModule,
    AuthModule,
    UserModule,
  ]
})
export class RoutesModule { }
