import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef, Inject, EventEmitter, Output } from '@angular/core';
import { DockerTerminal } from './docker-terminal';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { DockerService } from '../service/docker.service';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'app-docker-shell',
  templateUrl: './docker-shell.component.html',
  styleUrls: ['./docker-shell.component.scss']
})
export class DockerShellComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('terminal')
  terminalRef: ElementRef;

  @Output()
  event = new EventEmitter<string>();

  private terminal: DockerTerminal;


  constructor(
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService,
    private readonly route: ActivatedRoute,
    private readonly messageService: NzMessageService,
    private readonly dockerService: DockerService,
  ) {
  }

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
    setTimeout(() => {
      this.terminal.createTerminal(this.terminalRef.nativeElement);
      this.terminal.getState().on('end', value => {
        this.dockerService.showMessage({ reason: value }, this.messageService);
        // this.location.back();
        this.event.emit('end');
      });
      this.terminal.getState().on('err', value => {
        this.dockerService.showMessage(value, this.messageService);
        // this.location.back();
        this.event.emit('err');
      });
    }, 0);
  }

  public attachTerminalDom(): void {
    this.terminal.attachDom(this.terminalRef.nativeElement);
  }

  public resize(width: number, height: number) {
    this.terminalRef.nativeElement.style.width = width + 'px';
    this.terminalRef.nativeElement.style.height = height + 'px';
  }
}
