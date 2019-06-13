import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { Terminal } from './terminal';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('terminalContainer')
  terminalContainer: ElementRef;

  // private terminal: TerminalController = null;
  private terminal: Terminal = null;
  // private containerElement: HTMLElement = null;

  constructor(private readonly http: HttpClient, private readonly logger: NGXLogger, private elementRef: ElementRef) {
  }

  ngOnInit() {
    // this.terminal = new TerminalController(this.http, this.logger);
    this.terminal = new Terminal();
  }

  ngOnDestroy(): void {
    this.terminal.destroy();
  }

  ngAfterViewInit(): void {
    this.terminal.createTerminal(this.terminalContainer.nativeElement);
  }

  public getTerminal(): Terminal {
    return this.terminal;
  }

  public attachDom(): void {
    this.terminal.attachDom(this.terminalContainer.nativeElement);
  }
}

