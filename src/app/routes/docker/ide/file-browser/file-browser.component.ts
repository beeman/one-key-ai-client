import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileService } from '../../service/file.service';
import { NzTreeNode, NzFormatEmitEvent, NzDropdownContextComponent, NzContextMenuService, UploadXHRArgs, UploadChangeParam, NzDropdownMenuComponent } from 'ng-zorro-antd';
import { EnvironmentService } from '../../../../core/environment.service';
import { IdeService } from '../ide.service';
import { UserService } from 'src/app/core/user.service';

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
  @ViewChild('downloadElement', { static: false })
  downloadRef: ElementRef;  // 下载控件索引
  downloadElement: HTMLAnchorElement; // 下载控件
  // anchorEvent: MouseEvent;  // 下载事件

  @ViewChild('scanElement', { static: false })
  scanRef: ElementRef;  // 下载控件索引
  scanElement: HTMLAnchorElement; // 下载控件

  @ViewChild('folderMenu', { static: false })
  folderMenu: NzDropdownMenuComponent;

  @ViewChild('fileMenu', { static: false })
  fileMenu: NzDropdownMenuComponent;

  projectUploading = false; // 项目上传状态
  currentUploadingFile: string; // 当前上传的文件
  uploading = false;  // 上传状态（非项目）

  dropdown: NzDropdownContextComponent;
  fileList: FileNode[] = [];  // 项目列表
  activedNode: NzTreeNode = null;  // 选中的节点

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
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private nzContextMenuService: NzContextMenuService,
    private environmentService: EnvironmentService,
    private ideService: IdeService
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.downloadElement = <HTMLAnchorElement>(this.downloadRef.nativeElement);
    this.scanElement = <HTMLAnchorElement>(this.scanRef.nativeElement);
    // this.anchorEvent = new MouseEvent('click');
    this.fileService.getRootPath().subscribe(value => {
      if (value['msg'] === 'ok') {
        this.rootPath = value['data'];
      }
    });
    this.updateProjects();
    this.fileMenu.visible$.subscribe(value => {
      console.log(value);
    });
  }

  public updateProjects(): void {
    this.fileService.getProjectRecursive(this.userService.userName()).subscribe(
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

  closeContextMenu(event: MouseEvent): void {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (this.fileMenu.open || this.folderMenu.open) {
      this.nzContextMenuService.close();
    }
  }

  openNode(event: NzFormatEmitEvent): void {
    this.activeNode(event.node);
    if (this.fileMenu.open || this.folderMenu.open) {
      this.nzContextMenuService.close();
    }

    if (event.node.isLeaf) {
      this.openFile(event.node);
    } else {
      this.openFolder(event.node);
    }
  }

  openFolder(node: NzTreeNode): void {
    if (!node) {
      return;
    }

    node.isExpanded = !node.isExpanded;
    this.expandFolder(node);
  }

  openFile(node: NzTreeNode): void {
    if (!node) {
      return;
    }

    if (!this.canOpen(node)) {
      return;
    }
    this.ideService.getOpenFileEvent().emit(node.key);
  }

  activeNode(node: NzTreeNode): void {
    this.activedNode = node;
  }

  contextMenu(event: NzFormatEmitEvent) {
    event.event.preventDefault();
    if (this.fileMenu.open || this.folderMenu.open) {
      this.nzContextMenuService.close();
      return;
    }

    this.activeNode(event.node);
    if (event.node.isLeaf) {
      this.nzContextMenuService.create(event.event, this.fileMenu);
    } else {
      this.nzContextMenuService.create(event.event, this.folderMenu);
    }
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
    return node && node.isLeaf && node.key.endsWith('.zip');
  }

  // 是否可以打开
  canOpen(node: NzTreeNode): boolean {
    return node && !this.isImage(node) && !this.canUncompress(node);
  }

  downloadFile(node: NzTreeNode): void {
    const pathItems = node.key.split('/');
    const name = pathItems[pathItems.length - 1];
    const filePath = node.key.substr(this.rootPath.length);

    this.downloadElement.href = this.environmentService.serverUrl() + filePath;
    this.downloadElement.download = name;
    this.downloadElement.dispatchEvent(new MouseEvent('click'));
  }

  isLeaf(node: NzTreeNode) {
    return node && node.isLeaf;
  }

  isImage(node: NzTreeNode): boolean {
    if (!node || !node.isLeaf) {
      return false;
    }

    const tails = ['.png', 'jpg', 'ico'];

    for (let i = 0; i < tails.length; ++i) {
      if (node.key.endsWith(tails[i])) {
        return true;
      }
    }

    return false;
  }

  scan(node: NzTreeNode): void {
    if (!node) {
      return;
    }

    const filePath = node.key.substr(this.rootPath.length);

    this.scanElement.href = this.environmentService.serverUrl() + filePath;
    this.scanElement.target = '_blank';
    this.scanElement.dispatchEvent(new MouseEvent('click'));
  }

  onExpandChange(event: NzFormatEmitEvent): void {
    if (event.eventName === 'expand') {
      const node = event.node;
      this.expandFolder(node);
    }
  }

  private expandFolder(node: NzTreeNode): void {
    if (node) {
      if (node.getChildren().length === 0 && node.isExpanded) {
        node.addChildren(this.getChildNodes(this.findNode(this.wholeFileList, node.key).children));
      } else if (!node.isExpanded) {
        node.clearChildren();
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

  projectPath(): string {
    return `/home/${this.userService.userName()}`;
  }

  showRemoveModal(node: NzTreeNode): void {
    if (node.isLeaf) {
      this.modalInfo.modalTitle = '是否删除文件';
      this.modalInfo.isDir = false;
    } else {
      this.modalInfo.modalTitle = '是否删除文件夹';
      this.modalInfo.isDir = true;
    }

    this.modalInfo.modalMessage = node.origin.title;
    this.modalInfo.node = node;
    this.modalInfo.alertModalVisible = true;
  }

  showRemoveFileModal(node: NzTreeNode): void {
    this.modalInfo.modalTitle = '是否删除文件';
    this.modalInfo.isDir = false;

    this.modalInfo.modalMessage = node.origin.title;
    this.modalInfo.node = node;
    this.modalInfo.alertModalVisible = true;
  }

  showRemoveDirModal(node: NzTreeNode): void {
    this.modalInfo.modalTitle = '是否删除文件夹';
    this.modalInfo.isDir = true;

    this.modalInfo.modalMessage = node.origin.title;
    this.modalInfo.node = node;
    this.modalInfo.alertModalVisible = true;
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
    formData.append('userName', this.userService.userName());
    formData.append('fileName', item.file.name);

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
