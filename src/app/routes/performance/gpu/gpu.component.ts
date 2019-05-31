import { Component, OnInit, OnDestroy } from '@angular/core';
import * as io from 'socket.io-client';
import { EnvironmentService } from 'src/app/core/environment.service';

@Component({
  selector: 'app-gpu',
  templateUrl: './gpu.component.html',
  styleUrls: ['./gpu.component.scss']
})
export class GpuComponent implements OnInit, OnDestroy {
  stats = null;

  private socket: SocketIOClient.Socket;

  constructor(
    private readonly environmentService: EnvironmentService,
  ) { }

  ngOnInit() {
    this.socket = io.connect(this.environmentService.serverUrl());
    this.socket.emit('nvidiaStats');
    this.socket.on('data', (data) => {
      this.stats = JSON.stringify(data);
      // console.log(data);
    });
  
   
  }

  ngOnDestroy(): void {
    if(this.socket){
      this.socket.close();
    }
  }
}
