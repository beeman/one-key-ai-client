import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { TerminalController } from './terminal';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit, AfterViewInit, OnDestroy {
  private terminal: TerminalController = null;
  private containerElement: HTMLElement = null;

  constructor(private readonly http: HttpClient, private readonly logger: NGXLogger, private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.terminal = new TerminalController(this.http, this.logger);
  }

  ngOnDestroy(): void {
    this.terminal.destroy();
  }

  ngAfterViewInit(): void {
    this.containerElement = this.elementRef.nativeElement.querySelector('div');
    this.terminal.createTerminal(this.containerElement);
  }

  public getTerminal(): TerminalController {
    return this.terminal;
  }
}

