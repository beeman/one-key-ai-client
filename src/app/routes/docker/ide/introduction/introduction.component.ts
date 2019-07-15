import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit {
  commandMap = [
    { info: '保存当前文件', command: 'Ctrl + S' },
    { info: '保存全部文件', command: 'Ctrl + Shift + S' },
  ];

  @Output('event')
  event: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.event.emit({ 'event': 'ngAfterViewInit' });
  }
}
