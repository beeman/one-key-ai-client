import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface User {
  name: string;
  password: string;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private serverUrl = '';

  constructor(private readonly http: HttpClient) {
    this.serverUrl = environment.serverUrl;
  }

  public checkAdmin(userName: string) {
    return this.http.post(this.serverUrl + '/auth/check-admin', { userName: userName });
  }

  public deleteUser(name: string) {
    return this.http.post(this.serverUrl + '/users/delete', { name: name });
  }

  public getAllUsers() {
    return this.http.post(this.serverUrl + '/users/all', {});
  }

  public addUser(name: string, password: string, isAdmin: boolean) {
    return this.http.post(this.serverUrl + '/users/add', { name: name, password: password, isAdmin: isAdmin });
  }

  public updateUser(name: string, password: string, isAdmin: boolean) {
    return this.http.post(this.serverUrl + '/users/update', { name: name, password: password, isAdmin: isAdmin });
  }
}
