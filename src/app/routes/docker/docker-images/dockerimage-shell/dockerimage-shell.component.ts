import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DockerImageShell } from './docker-image-shell';

@Component({
  selector: 'app-dockerimage-shell',
  templateUrl: './dockerimage-shell.component.html',
  styleUrls: ['./dockerimage-shell.component.scss']
})
export class DockerimageShellComponent implements OnInit {
  @ViewChild('terminalContainer')
  terminalContainer: ElementRef;

  // private terminal: TerminalController = null;
  private terminal: DockerImageShell = null;
  // private containerElement: HTMLElement = null;

  constructor() {
  }

  ngOnInit() {
    // this.terminal = new TerminalController(this.http, this.logger);
    this.terminal = new DockerImageShell();
  }

  ngOnDestroy(): void {
    this.terminal.destroy();
  }

  ngAfterViewInit(): void {
    this.terminal.createTerminal(this.terminalContainer.nativeElement);
  }

  public getTerminal(): DockerImageShell {
    return this.terminal;
  }

  public attachDom(): void {
    this.terminal.attachDom(this.terminalContainer.nativeElement);
  }
}
