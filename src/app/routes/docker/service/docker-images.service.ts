import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import * as Docker from 'dockerode';

@Injectable({
  providedIn: 'root'
})
export class DockerImagesService {
  private serverUrl = '';

  constructor(private http: HttpClient) {
    this.serverUrl = environment.serverUrl;
  }

  public createContainer(data: any) {
    return this.http.post(this.serverUrl + '/images/create-container', data);
  }

  public getInfo(): Observable<Docker.ImageInfo[]> {
    return this.http.get<Docker.ImageInfo[]>(this.serverUrl + '/images/info');
  }

  public removeImage(id: string): Observable<any> {
    return this.http.post(this.serverUrl + '/images/remove', { id: id });
  }

  public searchImage(name: string) {
    return this.http.post(this.serverUrl + '/images/search', { name: name });
  }
}
