import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef, Inject, EventEmitter } from '@angular/core';
import { DockerTerminal } from './docker-terminal';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NzMessageService, UploadXHRArgs, UploadChangeParam, P, UploadFile } from 'ng-zorro-antd';
import { DockerService } from '../service/docker.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { HttpRequest, HttpEvent, HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-docker-shell',
  templateUrl: './docker-shell.component.html',
  styleUrls: ['./docker-shell.component.scss']
})
export class DockerShellComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('terminal')
  terminalRef: ElementRef;

  public uploading = false;
  public currentUploadingFile: string;
  private terminal: DockerTerminal;


  constructor(
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService,
    private readonly route: ActivatedRoute,
    private readonly messageService: NzMessageService,
    private readonly dockerService: DockerService,
    private location: Location,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(value => {
      const id = value.get('id');
      this.terminal = new DockerTerminal(id);
    }).unsubscribe();
  }

  ngOnDestroy(): void {
    this.terminal.destroy();
  }

  ngAfterViewInit(): void {
    this.terminal.createTerminal(this.terminalRef.nativeElement);
    this.terminal.getState().on('end', value => {
      this.dockerService.showMessage({ reason: value }, this.messageService);
      this.location.back();
    });
    this.terminal.getState().on('err', value => {
      this.dockerService.showMessage(value, this.messageService);
      this.location.back();
    });
  }

  customReq = (item: UploadXHRArgs) => {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    formData.append(item.name, item.file as any);
    formData.append('webkitRelativePath', item.file.webkitRelativePath);
    formData.append('userName', this.tokenService.get().userName);
    const req = new HttpRequest('POST', item.action!, formData, {
      reportProgress: true,
      withCredentials: true,
    });
    // 始终返回一个 `Subscription` 对象，nz-upload 会在适当时机自动取消订阅
    return this.http.post(item.action, formData).subscribe(
      value => {
        if (value['msg'] !== 'ok') {
          item.onError!(value['data'], item.file!);
        } else {
          // item.onProgress!({ percent: 100 }, item.file!);
          item.onSuccess!(value['data'], item.file!, value);

        }
      },
      err => {
        // 处理失败
        item.onError!(err, item.file!);
      }
    );
  }

  public uploadChange(event: UploadChangeParam) {
    this.uploading = true;
    this.currentUploadingFile = event.file.name;

    if (event.file.status === 'done') {
      let done = true;
      for (let i = 0; i < event.fileList.length; ++i) {
        const file = event.fileList[i];
        if (file.status !== 'done') {
          done = false;
          break;
        }
      }
      if (done) {
        this.uploading = false;
        this.currentUploadingFile = '上传完成';
      }
    }

  }


  // private fileList: any[] = null;
  // private num = 0;
  // public beforeUpload = (file: UploadFile, fileList: UploadFile[]): boolean => {
  //   if (this.fileList === null) {
  //     this.fileList = fileList;
  //   }
  //   if (++this.num >= this.fileList.length) {
  //     const formData = new FormData();
  //     // tslint:disable-next-line:no-any
  //     this.fileList.forEach((file: any) => {
  //       formData.append('files[]', file);
  //     });
  //     this.http.post(this.uploadPath(), formData).subscribe(
  //       value => {
  //         console.log(value);
  //       },
  //       err => {
  //         console.error(err);
  //       }
  //     );
  //   }
  //   return false;
  // }

  public uploadPath(): string {
    return environment.serverUrl + '/upload/';
  }
}
