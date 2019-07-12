import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef, Inject, EventEmitter, Output } from '@angular/core';
import { DockerTerminal } from './docker-terminal';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { DockerService } from '../../service/docker.service';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { IdeService } from '../ide.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-docker-shell',
  templateUrl: './docker-shell.component.html',
  styleUrls: ['./docker-shell.component.scss']
})
export class DockerShellComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('terminal', { static: false })
  terminalRef: ElementRef;

  @Output()
  event = new EventEmitter<string>();

  private terminal: DockerTerminal;
  private execCommandSubscription: Subscription;


  constructor(
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService,
    private readonly route: ActivatedRoute,
    private readonly messageService: NzMessageService,
    private readonly dockerService: DockerService,
    private readonly ideService: IdeService
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(value => {
      const id = value.get('id');
      this.terminal = new DockerTerminal(id);
    }).unsubscribe();

    this.execCommandSubscription = this.ideService.getEvent().subscribe(data => {
      if (data.event === 'execCommand') {
        this.terminal.emit(data.data+'\n');
      }
    });
  }

  ngOnDestroy(): void {
    this.terminal.destroy();
    this.execCommandSubscription!.unsubscribe();
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
