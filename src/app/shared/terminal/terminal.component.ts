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
    this.terminal = new TerminalController(http, logger);

  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.terminal.close();
  }

  ngAfterViewInit(): void {
    console.log('after');
    this.containerElement = this.elementRef.nativeElement.querySelector('div');
    this.terminal.createTerminal(this.containerElement);
  }

  public getTerminal(): TerminalController {
    return this.terminal;
  }
}

