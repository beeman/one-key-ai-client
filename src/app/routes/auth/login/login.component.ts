import { Component, OnInit, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ITokenService, DA_SERVICE_TOKEN, TokenService } from '@delon/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
  }


  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls[i].invalid) {
        return;
      }
    }

    const userName = this.validateForm.get('userName').value;
    const password = this.validateForm.get('password').value;
    this.http.post(environment.serverUrl + '/auth/login?_allow_anonymous=true', { userName: userName, password: password }).subscribe((value: any) => {
      if (value.msg !== 'ok') {
        this.errorMessage = value.msg;
        return;
      } else {
        const token = value.token;
        this.tokenService.set({ token: token, userName: userName });
        let url = this.tokenService.referrer.url || '/';
        if (url.includes('/auth')) {
          url = '/'
        };
        this.router.navigateByUrl(url);
      }
    });
  }


  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }
}
