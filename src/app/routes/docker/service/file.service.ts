import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private serverUrl: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService,
  ) {
    this.serverUrl = environment.serverUrl;
  }

  public compress(path: string, isFile: boolean) {
    return this.http.post(this.serverUrl + '/file/compress', { path: path, isFile: isFile });
  }

  public getRootPath() {
    return this.http.post(this.serverUrl + '/file/root-path', null);
  }

  public getProjectRecursive(userName: string) {
    return this.http.post(this.serverUrl + '/file/projects-recursive', { userName: userName });
  }

  public getProjectList(userName: string) {
    return this.http.post(this.serverUrl + '/file/projects', { userName: userName });
  }

  public getFileList(path: string) {
    return this.http.post(this.serverUrl + '/file/list', { path: path });
  }

  public getFileListRecursive(path: string) {
    return this.http.post(this.serverUrl + '/file/list-recursive', { path: path });
  }

  public newFile(path: string, isDir: boolean) {
    return this.http.post(this.serverUrl + '/file/new-file', { path: path, isDir: isDir });
  }

  public openFile(filePath: string) {
    return this.http.post(this.serverUrl + '/file/open-file', { path: filePath });
  }

  public saveFile(filePath: string, content: string) {
    return this.http.post(this.serverUrl + '/file/save-file', { filePath: filePath, content: content });
  }

  public uploadFile(formData: FormData) {
    return this.http.post(this.uploadPath(), formData);
  }

  public removeFile(filePath: string) {
    return this.http.post(this.serverUrl + '/file/remove-file', { path: filePath });
  }

  public removeDir(dirPath: string) {
    return this.http.post(this.serverUrl + '/file/remove-dir', { path: dirPath });
  }

  public uncompress(path: string) {
    return this.http.post(this.serverUrl + '/file/uncompress', { path: path });
  }

  // public uploadReq = (item: UploadXHRArgs) => {
  //   const formData = new FormData();
  //   // tslint:disable-next-line:no-any
  //   formData.append(item.name, item.file as any);
  //   formData.append('webkitRelativePath', item.file.webkitRelativePath);
  //   formData.append('userName', this.tokenService.get().userName);
  //   // const req = new HttpRequest('POST', item.action!, formData, {
  //   //   reportProgress: true,
  //   //   withCredentials: true,
  //   // });
  //   return this.http.post(this.uploadPath(), formData).subscribe(
  //     value => {
  //       if (value['msg'] !== 'ok') {
  //         item.onError!(value['data'], item.file!);
  //         console.error(value['data']);
  //       } else {
  //         item.onSuccess!(value['data'], item.file!, value);
  //       }
  //     },
  //     err => {
  //       // 处理失败
  //       console.error(err);
  //       item.onError!(err, item.file!);
  //     }
  //   );
  // }

  private uploadPath(): string {
    return environment.serverUrl + '/file/upload/';
  }
}
