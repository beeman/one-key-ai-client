import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { FileService } from '../../service/file.service';
import { NzTreeNode, NzFormatEmitEvent, NzDropdownContextComponent, NzDropdownService, UploadXHRArgs } from 'ng-zorro-antd';

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
  dropdown: NzDropdownContextComponent;
  fileList: FileNode[] = [];
  activedNode: NzTreeNode;

  private wholeFileList: FileNode[] = [];

  constructor(
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService,
    private readonly fileService: FileService,
    private nzDropdownService: NzDropdownService
  ) { }

  ngOnInit() {
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

  // activeNode(event: NzFormatEmitEvent): void {
  //   this.activedNode = event.node!;
  // }

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

  removeFile(node: NzTreeNode): void {
    // console.log(filePath);
    this.fileService.removeFile(node.key).subscribe(value => {
      if (value['msg'] === 'ok') {
        this.updateNode(node.parentNode);
      } else {
        console.error(value['data']);
      }
    });
  }

  removeDir(node: NzTreeNode): void {
    // console.log(filePath);
    this.fileService.removeDir(node.key).subscribe(value => {
      if (value['msg'] === 'ok') {
        this.updateNode(node.parentNode);
      } else {
        console.error(value['data']);
      }
    });
  }

  // selectDropdown(): void {
  //   this.dropdown.close();
  //   // do something
  // }

  uploadFile(): void {
    // this.fileService.uploadReq()
  }

  public uploadReq = (item: UploadXHRArgs) => {
    const formData = new FormData();
    const node = this.activedNode;
    console.log(item);
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
          this.updateNode(node);
        }
      },
      err => {
        // 处理失败
        console.error(err);
        item.onError!('', item.file!);
      }
    );
  }

  private updateNode(node: NzTreeNode) {
    this.fileService.getFileListRecursive(node.key).subscribe(value => {
      const currentNode = this.findNode(this.wholeFileList, node.key);
      currentNode.children = <any>value['data'];
      if (node.isExpanded) {
        node.clearChildren();
        node.addChildren(currentNode.children);
      }
    });
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
