import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IdeService } from '../../ide.service';
import { Subscription } from 'rxjs';
import { EditorComponent } from '../editor.component';
import { NzMessageService } from 'ng-zorro-antd';

class FileInfo {
  path: string;
  name: string;
  icon: string;

  constructor(path: string, name: string, icon: string = 'close') {
    this.path = path;
    this.name = name;
    this.icon = icon;
  }
}

@Component({
  selector: 'app-editor-group',
  templateUrl: './editor-group.component.html',
  styleUrls: ['./editor-group.component.scss']
})
export class EditorGroupComponent implements OnInit {
  @ViewChild('tabset', { static: false })
  tabsetRef: any;

  @ViewChildren(EditorComponent)
  editorComponents: any;

  files: FileInfo[] = []; // 文件列表
  selectedIndex = 0;
  currentLanguage: string = '';

  filesToSave: FileInfo[] = []; // 待保存的文件
  saveModalVisible: boolean = false;  // 保存文件对话框
  isCloseFile: boolean = false;  // 是否关闭文件

  private contentElement: HTMLElement = null;
  private openFileSubscription: Subscription = null;
  private editorHeight: string = '100px';

  constructor(
    public readonly ideService: IdeService,
    private readonly messageService: NzMessageService
  ) { }

  ngOnInit() {
    this.openFileSubscription = this.ideService.getEvent().subscribe((data) => {
      if (data.event === 'openFile') {
        this.openFile(data.data);
      }
    });

    // window.onbeforeunload = (event) => {
    //   console.log('change');
    //   window.stop();
    //   // window.event.returnValue=false;
    // };
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const element = this.tabsetRef.elementRef.nativeElement;
      const wholeHeight = element.clientHeight;
      this.contentElement = element.lastChild;
      const offsetTop = this.contentElement.offsetTop;
      this.editorHeight = wholeHeight - offsetTop + 'px';
    }, 0);
  }

  ngOnDestroy(): void {
    this.openFileSubscription!.unsubscribe();
  }

  public changeLanguage(): void {
    this.getCurrentEditor().changeLanguage(this.currentLanguage);
  }

  public changeEditor(index: number): void {
    this.currentLanguage = this.getEditor(index).getLanguageId();
  }

  public closeFile(file: FileInfo): void {
    const index = this.findIndex(file.path);

    // 若文件内容发生变化，提示是否删除
    const isChanged = this.getEditor(index).isContentChanged();
    if (isChanged) {
      this.filesToSave = [file];
      this.isCloseFile = true;
      this.saveModalVisible = true;
      return;
    }

    this.files.splice(index, 1);
  }

  public execFile(): void {
    const file = this.files[this.selectedIndex];
    if (!file) {
      return;
    }
    if (file.name.endsWith('.py')) {
      const containerFilePath = this.ideService.changeToContainerPath(file.path);;
      const command = `python ${containerFilePath}`;

      this.ideService.getEvent().emit({ event: 'execCommand', data: command })
    } else {
      this.messageService.info('仅支持python文件');
    }
  }

  // public tabIcon(file: FileInfo): string {
  //   return this.isFileChanged(file) ? 'close-circle' : 'close';
  // }

  // public isFileChanged(file: FileInfo): boolean {
  //   const index = this.findIndex(file.path);
  //   const component = this.getEditor(index);

  //   if (component) {
  //     return this.getEditor(index)!.isContentChanged();
  //   } else {
  //     return false;
  //   }
  // }

  public onEditorEvent(event: any): void {
    if (event.event === 'languageChanged') {
      this.currentLanguage = this.getCurrentEditor().getLanguageId();
    }
    if (event.event === 'contentChanged') {
      const data = event.data;
      const index = this.files.findIndex(value => {
        return value.path === data.path;
      });
      if (index >= 0) {
        if (data.changed) {
          this.files[index].icon = 'close-circle';
        } else {
          this.files[index].icon = 'close';
        }
      }
    }
    // if (event.event === 'init' && this.lauguageIds.length <= 0) {
    //   this.ideService.getLanguages().forEach(value => {
    //     this.lauguageIds.push(value.id);
    //   });
    // }
  }

  public onSaveModalCancel(): void {
    this.saveModalVisible = false;
  }

  public onSaveModalConfirm(): void {
    if (this.filesToSave.length === 0) {
      this.saveModalVisible = false;
    }
    this.filesToSave.forEach(file => {
      const index = this.findIndex(file.path);
      this.getEditor(index).saveFile(() => {
        if (this.isCloseFile) {
          this.files.splice(index, 1);
        }
        this.saveModalVisible = false;
      });
    });
  }

  public onSaveModalDeny(): void {
    this.saveModalVisible = false;
    this.filesToSave.forEach(file => {
      const index = this.findIndex(file.path);
      if (this.isCloseFile) {
        this.files.splice(index, 1);
      }
    });
  }

  public saveAllFiles(): void {
    this.filesToSave = [];
    this.getAllEditors().forEach((editor, index) => {
      if (editor.isContentChanged()) {
        this.filesToSave.push(this.files[index]);
      }
    });
    this.isCloseFile = false;
    this.saveModalVisible = true;
  }

  private getCurrentEditor(): EditorComponent {
    return this.getEditor(this.selectedIndex);
  }

  private findIndex(filePath: string): number {
    return this.files.findIndex((value => {
      return value.path === filePath;
    }));
  }

  private getAllEditors(): EditorComponent[] {
    return this.editorComponents._results;
  }

  private getEditor(index: number): EditorComponent {
    return this.getAllEditors()[index];
  }

  private openFile(filePath: string): void {
    const tabIndex = this.findIndex(filePath);

    if (tabIndex >= 0) {
      this.selectedIndex = tabIndex;
      return;
    }

    const items = filePath.split('/');
    this.files.push(new FileInfo(filePath, items[items.length - 1]));
    this.selectedIndex = this.files.length - 1;

    setTimeout(() => {
      (<HTMLElement>this.contentElement.children[this.selectedIndex]).style.height = this.editorHeight;
    }, 0);
  }

}
