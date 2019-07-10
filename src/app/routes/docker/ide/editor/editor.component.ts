import { Component, OnInit, EventEmitter, ViewChild, ElementRef, Output, Input } from '@angular/core';
import { FileService } from '../../service/file.service';
import { IdeService } from '../ide.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @ViewChild('editor', { static: false })
  editorRef: ElementRef;

  @Output('editorEvent')
  editorEvent = new EventEmitter<any>();

  @Input('filePath')
  filePath: string;

  editorOptions = { theme: 'vs-dark', language: 'python', automaticLayout: true };

  private change: monaco.editor.IModelContentChangedEvent = null;
  private changeEvent: EventEmitter<monaco.editor.IModelContentChangedEvent> = new EventEmitter();
  private editor: monaco.editor.IStandaloneCodeEditor;
  private languageId: string = 'plaintext';
  private contentChanged: boolean = false;  // 文本是否发生变化

  constructor(
    private readonly fileService: FileService,
    private readonly messageService: NzMessageService,
    private readonly ideService: IdeService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  onEditorInit(editor: monaco.editor.IStandaloneCodeEditor) {
    // 记录支持的语言
    if (this.ideService.getLanguages().length <= 0) {
      this.ideService.setLanguages(monaco.languages.getLanguages());
    }

    this.editor = editor;

    // 监听保存快捷键
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      this.saveFile();
    }, '');

    this.editor.onDidChangeModelContent((e: monaco.editor.IModelContentChangedEvent) => {
      this.contentChanged = true;
    });

    this.openFile();

    // this.editorEvent.emit({ event: 'init', target: this });

    // monaco.editor.setModelLanguage(editor.getModel(),'cpp');

    // this.editorOptions.language = 'python';
    // 调整编辑页面大小
    // console.log(this.editorRef);
    // const editorHeight = (<any>this.editorRef)._editorContainer.nativeElement.clientHeight;
    // console.log(editorHeight);
    // this.editor.getDomNode().style.height = editorHeight + 'px';
    // this.editor.getDomNode().childNodes.
    // (<HTMLElement>this.editor.getDomNode().getElementsByClassName('editor-container')[0]).style.height = editorHeight + 'px';
    // (<HTMLElement>document.getElementsByClassName('editor-container')[0]).style.height = editorHeight + 'px';


    // if (navigator.userAgent.indexOf("Firefox") > 0) {
    //   this.changeEvent.pipe(throttleTime(1)).subscribe(value => {
    //     this.change = value;
    //   });
    //   this.changeEvent.pipe(auditTime(1)).subscribe(value => {
    //     if (this.change === value) {
    //     } else {
    //       editor.trigger('', 'undo', '');
    //       // if (value.changes[0].range.startColumn !== value.changes[0].range.endColumn) {
    //       //   editor.trigger('', 'undo', '');
    //       // } else {
    //       //   editor.executeEdits('', [{
    //       //     text: null,
    //       //     range: new monaco.Range(
    //       //       value.changes[0].range.startLineNumber,
    //       //       value.changes[0].range.startColumn - 1,
    //       //       value.changes[0].range.startLineNumber,
    //       //       value.changes[0].range.startColumn)
    //       //   }]);
    //       // }
    //     }
    //   });
    //   editor.onDidChangeModelContent(e => {
    //     this.changeEvent.emit(e);
    //   });
    // }
  }

  public changeLanguage(language: string): void {
    this.languageId = language;
    monaco.editor.setModelLanguage(this.editor.getModel(), this.languageId);
  }

  public getLanguageId(): string {
    return this.languageId;
  }

  public isContentChanged(): boolean {
    return this.contentChanged;
  }


  public saveFile(callback: () => void = null): void {
    this.fileService.saveFile(this.filePath, this.editor.getValue()).subscribe(value => {
      if (value['msg'] === 'ok') {
        this.contentChanged = false;  // 设置文本未变化
        if (callback !== null) {
          callback();
        }
      } else {
        this.messageService.error(`保存失败:${value['data']}`);
      }
    });
  }

  private openFile(): void {
    this.fileService.openFile(this.filePath).subscribe(value => {
      if (value['msg'] === 'ok') {
        this.languageId = this.ideService.suggestLanguageId(this.filePath);
        monaco.editor.setModelLanguage(this.editor.getModel(), this.languageId);
        this.editorEvent.emit({ event: 'changeLanguage', language: this.languageId });

        this.editor!.setValue(value['data']);

        this.contentChanged = false; // 默认文本未发生变化
      }
      else if (value['msg'] === 'warning') {
        this.messageService.warning(value['data']);
      }
      else {
        this.messageService.error(value['data']);
      }
    });
  }
}
