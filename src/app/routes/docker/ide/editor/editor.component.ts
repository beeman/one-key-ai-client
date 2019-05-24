import { Component, OnInit, EventEmitter } from '@angular/core';
import { throttleTime, auditTime } from 'rxjs/operators';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  editorOptions = { theme: 'vs-dark', language: 'python' };
  private change: monaco.editor.IModelContentChangedEvent = null;
  private changeEvent: EventEmitter<monaco.editor.IModelContentChangedEvent> = new EventEmitter();
  constructor() { }

  ngOnInit() {

  }

  onEditorInit(editor: monaco.editor.ICodeEditor) {
    if (navigator.userAgent.indexOf("Firefox") > 0) {
      this.changeEvent.pipe(throttleTime(1)).subscribe(value => {
        this.change = value;
      });
      this.changeEvent.pipe(auditTime(1)).subscribe(value => {
        if (this.change === value) {
        } else {
          editor.trigger('', 'undo', '');
          // if (value.changes[0].range.startColumn !== value.changes[0].range.endColumn) {
          //   editor.trigger('', 'undo', '');
          // } else {
          //   editor.executeEdits('', [{
          //     text: null,
          //     range: new monaco.Range(
          //       value.changes[0].range.startLineNumber,
          //       value.changes[0].range.startColumn - 1,
          //       value.changes[0].range.startLineNumber,
          //       value.changes[0].range.startColumn)
          //   }]);
          // }
        }
      });
      editor.onDidChangeModelContent(e => {
        this.changeEvent.emit(e);
      });
    }
  }

}
