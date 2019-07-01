import { Component, OnInit, Inject, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { FileService } from '../../service/file.service';
import { NzTreeNode, NzFormatEmitEvent, NzDropdownContextComponent, NzDropdownService, UploadXHRArgs, UploadChangeParam } from 'ng-zorro-antd';
import { EnvironmentService } from '../../../../core/environment.service';

interface FileNode {
  title: string;
  key: string;
  isLeaf: boolean;
  children: FileNode[];
}

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.scss']
})
export class FileBrowserComponent implements OnInit {
  @ViewChild('downloadElement')
  downloadRef: ElementRef;  // 下载控件索引
  downloadElement: HTMLAnchorElement; // 下载控件
  anchorEvent: MouseEvent;  // 下载事件

  @ViewChild('scanElement')
  scanRef: ElementRef;  // 下载控件索引
  scanElement: HTMLAnchorElement; // 下载控件

  projectUploading = false; // 项目上传状态
  currentUploadingFile: string; // 当前上传的文件
  uploading = false;  // 上传状态（非项目）

  dropdown: NzDropdownContextComponent;
  fileList: FileNode[] = [];  // 项目列表
  activedNode: NzTreeNode;  // 选中的节点

  private rootPath = '';  // 项目文件保存的根目录

  modalInfo: {
    alertModalVisible: boolean;
    modalTitle: string;
    modalMessage: string;
    node: NzTreeNode;
    isDir: boolean;
  } = { alertModalVisible: false, modalTitle: '', modalMessage: '', node: null, isDir: false };

  private wholeFileList: FileNode[] = []; // 所有文件信息

  constructor(
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService,
    private readonly fileService: FileService,
    private nzDropdownService: NzDropdownService,
    private environmentService: EnvironmentService
  ) { }

  ngOnInit() {
    this.downloadElement = <HTMLAnchorElement>(this.downloadRef.nativeElement);
    this.scanElement = <HTMLAnchorElement>(this.scanRef.nativeElement);
    this.anchorEvent = new MouseEvent('click');
    this.fileService.getRootPath().subscribe(value => {
      if (value['msg'] === 'ok') {
        this.rootPath = value['data'];
      }
    });
    this.updateProjects();
  }

  public updateProjects(): void {
    this.fileService.getProjectRecursive(this.tokenService.get().userName).subscribe(
      value => {
        if (value['msg'] === 'ok') {
          // this.fileList = value['data'];
          this.wholeFileList = value['data'];
          this.fileList = this.getChildNodes(this.wholeFileList);
        } else {
          console.error(value);
        }
      }
    );
  }

  openFolder(data: NzTreeNode | Required<NzFormatEmitEvent>): void {
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      const node = data.node;
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
    }
  }

  activeNode(node: NzTreeNode): void {
    this.activedNode = node;
  }

  compress(node: NzTreeNode): void {
    this.fileService.compress(node.key, node.isLeaf).subscribe(value => {
      if (value['msg'] === 'ok') {
        this.updateNode(node.parentNode);
      } else {
        console.error(value['data']);
      }
    });
  }

  canUncompress(node: NzTreeNode): boolean {
    return node.key.endsWith('.zip');
  }

  downloadFile(node: NzTreeNode): void {
    const pathItems = node.key.split('/');
    const name = pathItems[pathItems.length - 1];
    const filePath = node.key.substr(this.rootPath.length);

    this.downloadElement.href = this.environmentService.serverUrl() + filePath;
    this.downloadElement.download = name;
    this.downloadElement.dispatchEvent(this.anchorEvent);
  }

  scan(node: NzTreeNode): void {
    const filePath = node.key.substr(this.rootPath.length);

    this.scanElement.href = this.environmentService.serverUrl() + filePath;
    this.scanElement.target = '_blank';
    this.scanElement.dispatchEvent(this.anchorEvent);
  }

  contextMenu($event: MouseEvent, template: TemplateRef<void>, node: NzTreeNode): void {
    $event.preventDefault();

    this.dropdown = this.nzDropdownService.create(new MouseEvent('', { clientY: $event.layerY, clientX: $event.clientX }), template);
  }

  onExpandChange(event: NzFormatEmitEvent): void {
    if (event.eventName === 'expand') {
      const node = event.node;
      if (node) {
        if (node.getChildren().length === 0 && node.isExpanded) {
          node.addChildren(this.getChildNodes(this.findNode(this.wholeFileList, node.key).children));
        } else if (!node.isExpanded) {
          node.clearChildren();
        }
      }
    }
  }

  onModalCancel(): void {
    this.modalInfo.alertModalVisible = false;
  }

  onModalConfirm(): void {
    this.modalInfo.alertModalVisible = false;
    if (this.modalInfo.isDir) {
      this.removeDir(this.modalInfo.node);
    } else {
      this.removeFile(this.modalInfo.node);
    }
  }

  showRemoveFileModal(node: NzTreeNode): void {
    this.modalInfo.modalTitle = '是否删除文件';
    this.modalInfo.modalMessage = node.origin.title;
    this.modalInfo.node = node;
    this.modalInfo.alertModalVisible = true;
    this.modalInfo.isDir = false;
  }

  showRemoveDirModal(node: NzTreeNode): void {
    this.modalInfo.modalTitle = '是否删除文件夹';
    this.modalInfo.modalMessage = node.origin.title;
    this.modalInfo.node = node;
    this.modalInfo.alertModalVisible = true;
    this.modalInfo.isDir = true;
  }

  uncompress(node: NzTreeNode): void {
    this.fileService.uncompress(node.key).subscribe(value => {
      if (value['msg'] === 'ok') {
        this.updateNode(node.parentNode);
      } else {
        console.error(value['data']);
      }
    });
  }

  private removeFile(node: NzTreeNode): void {
    this.fileService.removeFile(node.key).subscribe(value => {
      if (value['msg'] === 'ok') {
        this.removeNode(node);
      } else {
        console.error(value['data']);
      }
    });
  }

  private removeDir(node: NzTreeNode): void {
    this.fileService.removeDir(node.key).subscribe(value => {
      if (value['msg'] === 'ok') {
        this.removeNode(node);
      } else {
        console.error(value['data']);
      }
    });
  }

  private removeNode(node: NzTreeNode): void {
    const parentNode = node.parentNode;
    if (parentNode) {
      this.updateNode(parentNode);
    } else {
      const index = this.wholeFileList.findIndex((value) => {
        return value.key == node.key;
      });
      this.wholeFileList.splice(index, 1);
      this.fileList = this.getChildNodes(this.wholeFileList);
    }
  }

  public uploadProjectReq = (item: UploadXHRArgs) => {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    formData.append(item.name, item.file as any);
    formData.append('webkitRelativePath', item.file.webkitRelativePath);
    formData.append('userName', this.tokenService.get().userName);

    return this.fileService.uploadFile(formData).subscribe(
      value => {
        if (value['msg'] !== 'ok') {
          item.onError!(value['data'], item.file!);
          console.error(value['data']);
        } else {
          item.onSuccess!(value['data'], item.file!, value);
        }
      },
      err => {
        // 处理失败
        console.error(err);
        item.onError!(err, item.file!);
      }
    );
  }

  public uploadProjectChange(event: UploadChangeParam) {
    this.projectUploading = true;
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
        this.projectUploading = false;
        this.currentUploadingFile = '上传完成';
        this.updateProjects();
      }
    }
  }

  public uploadReq = (item: UploadXHRArgs) => {
    const formData = new FormData();
    const node = this.activedNode;
    // tslint:disable-next-line:no-any
    formData.append(item.name, item.file as any);
    formData.append('dirPath', node.key);
    formData.append('fileName', item.file.name);
    formData.append('webkitRelativePath', item.file.webkitRelativePath);

    return this.fileService.uploadFile(formData).subscribe(
      value => {
        if (value['msg'] !== 'ok') {
          item.onError!(value['data'], item.file!);
        } else {
          item.onSuccess!(value['data'], item.file!, value);
        }
      },
      err => {
        // 处理失败
        console.error(err);
        item.onError!('', item.file!);
      }
    );
  }

  public uploadChange(event: UploadChangeParam) {
    this.uploading = true;

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
        this.updateNode(this.activedNode);
      }
    }
  }

  private updateNode(node: NzTreeNode) {
    if (node) {
      this.fileService.getFileListRecursive(node.key).subscribe(value => {
        const currentNode = this.findNode(this.wholeFileList, node.key);
        currentNode.children = <any>value['data'];
        if (node.isExpanded) {
          node.clearChildren();
          // node.addChildren(currentNode.children);
          node.addChildren(this.getChildNodes(currentNode.children));
        }
      });
    } else {
      this.updateProjects();
    }
  }

  private findNode(parentNodes: FileNode[], key: string): FileNode {
    for (let i = 0; i < parentNodes.length; ++i) {
      const node = parentNodes[i];
      if (node.key === key) {
        return node;
      }
      else if (key.startsWith(node.key)) {
        return this.findNode(node.children, key);
      }
    }
    return null;
  }

  private getChildNodes(parentNodes: FileNode[]): FileNode[] {
    const result: FileNode[] = [];
    parentNodes.forEach(node => {
      result.push({ title: node.title, key: node.key, isLeaf: node.isLeaf, children: [] });
    });
    return result;
  }
}
