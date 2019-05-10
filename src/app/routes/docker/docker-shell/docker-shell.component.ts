import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { DockerTerminal } from './docker-terminal';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { DockerService } from '../service/docker.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-docker-shell',
  templateUrl: './docker-shell.component.html',
  styleUrls: ['./docker-shell.component.scss']
})
export class DockerShellComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('terminal')
  terminalRef: ElementRef;

  private terminal: DockerTerminal;

  constructor(private readonly route: ActivatedRoute,
    private readonly messageService: NzMessageService,
    private readonly dockerService: DockerService,
    private location: Location) { }

  ngOnInit() {
    this.route.paramMap.subscribe(value => {
      const id = value.get('id');
      this.terminal = new DockerTerminal(id);
    }).unsubscribe();
  }

  ngOnDestroy(): void {
    this.terminal.destroy();
  }

  ngAfterViewInit(): void {
    this.terminal.createTerminal(this.terminalRef.nativeElement);
    this.terminal.getState().on('end', value => {
      this.dockerService.showMessage({ reason: value }, this.messageService);
      this.location.back();
    });
    this.terminal.getState().on('err', value => {
      this.dockerService.showMessage(value, this.messageService);
      this.location.back();
    });
  }

}
