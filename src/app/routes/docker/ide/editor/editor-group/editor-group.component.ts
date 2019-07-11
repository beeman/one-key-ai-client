import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IdeService } from '../../ide.service';
import { Subscription } from 'rxjs';
import { EditorComponent } from '../editor.component';

interface FileInfo {
  path: string;
  name: string;
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
    public readonly ideService: IdeService
  ) { }

  ngOnInit() {
    this.openFileSubscription = this.ideService.getOpenFileEvent().subscribe((filePath) => {
      this.openFile(filePath);
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

  public tabIcon(file: FileInfo): string {
    return this.isFileChanged(file) ? 'close-circle' : 'close';
  }

  public isFileChanged(file: FileInfo): boolean {
    const index = this.findIndex(file.path);
    const component = this.getEditor(index);

    if (component) {
      return this.getEditor(index)!.isContentChanged();
    } else {
      return false;
    }
  }

  public onEditorEvent(event: any): void {
    if (event.event === 'changeLanguage') {
      this.currentLanguage = this.getCurrentEditor().getLanguageId();
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
    this.files.push({ path: filePath, name: items[items.length - 1] });
    this.selectedIndex = this.files.length - 1;

    setTimeout(() => {
      (<HTMLElement>this.contentElement.children[this.selectedIndex]).style.height = this.editorHeight;
    }, 0);
  }

}
