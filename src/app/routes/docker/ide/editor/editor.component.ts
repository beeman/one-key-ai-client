import { Component, OnInit, EventEmitter } from '@angular/core';
import { throttleTime, auditTime } from 'rxjs/operators';
import { FileService } from '../../service/file.service';
import { IdeService } from '../ide.service';
import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  editorOptions = { theme: 'vs-dark', language: 'python', automaticLayout: true };

  private change: monaco.editor.IModelContentChangedEvent = null;
  private changeEvent: EventEmitter<monaco.editor.IModelContentChangedEvent> = new EventEmitter();
  private editor: monaco.editor.IStandaloneCodeEditor;
  private openFileSubscription: Subscription = null;
  private currentFilePath: string = '';

  constructor(
    private readonly fileService: FileService,
    private readonly ideService: IdeService,
    private readonly messageService: NzMessageService
  ) { }

  ngOnInit() {
    this.openFileSubscription = this.ideService.getOpenFileEvent().subscribe((filePath) => {
      this.openFile(filePath);
    });

  }

  ngOnDestroy(): void {
    this.openFileSubscription!.unsubscribe();
  }

  onEditorInit(editor: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editor;

    // 调整编辑页面大小
    const editorHeight = document.getElementsByClassName('code-editor')[0].clientHeight;
    this.editor.getDomNode().style.height = editorHeight + 'px';

    // 监听保存快捷键
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      this.saveFile();
    }, '');
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

  private openFile(filePath: string): void {
    this.fileService.openFile(filePath).subscribe(value => {
      if (value['msg'] === 'ok') {
        this.currentFilePath = filePath;
        this.editor!.setValue(value['data']);
      } else {
        console.error(value['data']);
      }
    });
  }

  private saveFile(): void {
    this.fileService.saveFile(this.currentFilePath, this.editor.getValue()).subscribe(value => {
      if (value['msg'] === 'ok') {
      } else {
        this.messageService.warning('保存失败');
        console.error(value['data']);
      }
    });
  }

}
