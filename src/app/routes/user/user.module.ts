import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ManagerComponent } from './manager/manager.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserEditorComponent } from './user-editor/user-editor.component';

@NgModule({
  declarations: [ManagerComponent, UserInfoComponent, UserEditorComponent],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
  ]
})
export class UserModule { }
