import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { FileService } from '../service/file.service';
import { NzTreeNode, NzFormatEmitEvent, NzDropdownContextComponent, NzDropdownService } from 'ng-zorro-antd';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.scss']
})
export class FileBrowserComponent implements OnInit {
  dropdown: NzDropdownContextComponent;
  fileList = null;
  activedNode: NzTreeNode;

  constructor(
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService,
    private readonly fileService: FileService,
    private nzDropdownService: NzDropdownService
  ) { }

  ngOnInit() {
    this.fileService.getFileList(this.tokenService.get().userName).subscribe(
      value => {
        if (value['msg'] === 'ok') {
          this.fileList = value['data'];
          console.log(this.fileList);
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

  activeNode(data: NzFormatEmitEvent): void {
    this.activedNode = data.node!;
  }

  contextMenu($event: MouseEvent, template: TemplateRef<void>): void {
    $event.preventDefault();
    this.dropdown = this.nzDropdownService.create(new MouseEvent('', { clientY: $event.layerY, clientX: $event.clientX }), template);
  }

  selectDropdown(): void {
    this.dropdown.close();
    // do something
  }
}
