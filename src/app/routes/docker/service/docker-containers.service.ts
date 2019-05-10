import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as Docker from 'dockerode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DockerContainersService {
  private serverUrl = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.serverUrl;
  }

  public getInfo(): Observable<Docker.ContainerInfo[]> {
    return this.http.get<Docker.ContainerInfo[]>(this.serverUrl + '/containers/info');
  }

  public exec(id: string) {
    return this.http.post(this.serverUrl + '/containers/exec', { id: id });
  }

  public stop(id: string) {
    return this.http.post(this.serverUrl + '/containers/stop', { id: id });
  }

  public kill(id: string) {
    return this.http.post(this.serverUrl + '/containers/kill', { id: id });
  }

  public start(id: string) {
    return this.http.post(this.serverUrl + '/containers/start', { id: id });
  }

  public restart(id: string) {
    return this.http.post(this.serverUrl + '/containers/restart', { id: id });
  }

  public remove(id: string) {
    return this.http.post(this.serverUrl + '/containers/remove', { id: id });
  }

  public rename(id: string, name: string) {
    return this.http.post(this.serverUrl + '/containers/rename', { id: id, name: name });
  }

}
