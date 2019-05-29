import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/core/user.service';
import { NzMessageService } from 'ng-zorro-antd';
import { User } from '../user';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {
  @Output()
  done = new EventEmitter<boolean>();

  userGroup: FormGroup;

  private nameControl: FormControl;
  private passwordControl: FormControl;
  private confirmPasswordControl: FormControl;
  private isAdminControl: FormControl;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly nzMessageService: NzMessageService
  ) { }

  ngOnInit() {
    this.userGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      password: new FormControl({ value: '', disabled: true }, Validators.required),
      confirmPassword: new FormControl({ value: '', disabled: true }, Validators.required),
      isAdmin: [false, [Validators.required]]
    });

    this.nameControl = <FormControl>this.userGroup.get('name');
    this.passwordControl = <FormControl>this.userGroup.get('password');
    this.confirmPasswordControl = <FormControl>this.userGroup.get('confirmPassword');
    this.isAdminControl = <FormControl>this.userGroup.get('isAdmin');

    this.confirmPasswordControl.setValidators(() => {
      if (this.confirmPasswordControl.value !== this.passwordControl.value) {
        return { match: false };
      }
      return null;
    });
  }

  public cancel(): void {
    this.done.emit(false);
  }

  public confirm(): void {
    if (!this.checkValidator()) {
      return;
    }
    const name = this.nameControl.value;
    const isAdmin = this.isAdminControl.value;
    let password = '';
    if (this.passwordControl.enabled) {
      password = this.passwordControl.value;
    }

    this.userService.updateUser(name, password, isAdmin).subscribe(data => {
      if (data['msg'] === 'ok') {
        this.done.emit(true);
      } else {
        this.nzMessageService.warning(data['data']);
      }
    });
  }

  public updateUser(user: User) {
    this.nameControl.setValue(user.name);
    this.isAdminControl.setValue(user.isAdmin);
  }

  public modifyPassword(value: boolean): void {
    if (value) {
      this.passwordControl.enable();
      this.confirmPasswordControl.enable();
    } else {
      this.passwordControl.disable();
      this.confirmPasswordControl.disable();
      this.passwordControl.setValue(null);
      this.confirmPasswordControl.setValue(null);
    }
  }

  private checkValidator(): boolean {
    return this.userGroup.valid;
  }
}
