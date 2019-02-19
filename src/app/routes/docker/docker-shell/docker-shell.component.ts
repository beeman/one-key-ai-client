import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TerminalComponent } from 'src/app/shared/terminal/terminal.component';
import { DockerExecutorService } from '../service/docker-executor.service';

@Component({
  selector: 'app-docker-shell',
  templateUrl: './docker-shell.component.html',
  styleUrls: ['./docker-shell.component.scss']
})
export class DockerShellComponent implements OnInit, AfterViewInit {
  @ViewChild('terminal')
  terminal: TerminalComponent;

  constructor(private dockerExecutorService: DockerExecutorService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.terminal.getTerminal().emit(this.dockerExecutorService.runCommand());
      this.terminal.getTerminal().emit(`cd ${this.dockerExecutorService.getParams().distPath}\n`);
    }, 100);
  }

}
