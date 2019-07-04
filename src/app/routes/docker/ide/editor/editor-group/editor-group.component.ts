import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IdeService } from '../../ide.service';
import { Subscription } from 'rxjs';
import { EditorComponent } from '../editor.component';

@Component({
  selector: 'app-editor-group',
  templateUrl: './editor-group.component.html',
  styleUrls: ['./editor-group.component.scss']
})
export class EditorGroupComponent implements OnInit {
  @ViewChild('tabset')
  tabsetRef: any;

  @ViewChildren(EditorComponent)
  editorComponents: any;

  files: { path: string, name: string, component?: EditorComponent }[] = [];
  selectedIndex = 0;
  currentLanguage: string = '';

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

  private getCurrentEditor(): EditorComponent {
    return this.getEditor(this.selectedIndex);
  }

  private getEditor(index: number): EditorComponent {
    return this.editorComponents._results[index];
  }

  private openFile(filePath: string): void {
    const tabIndex = this.files.findIndex((value => {
      return value.path === filePath;
    }));

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
