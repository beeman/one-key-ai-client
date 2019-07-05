import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/core/user.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  @ViewChild('name', { static: false })
  nameRef: ElementRef;

  @ViewChild('password', { static: false })
  passwordRef: ElementRef;

  @Output()
  done = new EventEmitter<boolean>();

  userGroup: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly nzMessageService: NzMessageService
  ) { }

  ngOnInit() {
    this.userGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      isAdmin: ['false', [Validators.required]]
    });
    this.userGroup.get('confirmPassword').setValidators(() => {
      if (this.userGroup.get('confirmPassword').value !== this.userGroup.get('password').value) {
        return { match: false };
      }
      return null;
    });

    // this.offAutoComplete();
  }

  public cancel(): void {
    this.done.emit(false);
  }

  public confirm(): void {
    if (this.checkValidator()) {
      const name = this.userGroup.get('name').value;
      const password = this.userGroup.get('password').value;
      const isAdmin = this.userGroup.get('isAdmin').value === 'true' ? true : false;

      this.userService.addUser(name, password, isAdmin).subscribe(value => {
        if (value['msg'] !== 'ok') {
          this.nzMessageService.warning(value['data']);
        } else {
          this.done.emit(true);
        }
      });

    }
  }

  private checkValidator(): boolean {
    let result = true;
    for (const key in this.userGroup.controls) {
      const control = this.userGroup.controls[key];
      control.markAsDirty();
      control.updateValueAndValidity();
      if (!control.valid) {
        result = false;
      }
    }

    return result;
  }


  private offAutoComplete(): void {
    [this.nameRef, this.passwordRef].forEach(elementRef => {
      const element = (<HTMLInputElement>(elementRef.nativeElement));
      const event = () => {
        this.userGroup.reset();
        this.userGroup.get('isAdmin').setValue('false');
        element.removeEventListener('change', event);
      };
      element.addEventListener('change', event);
    });
  }

}
