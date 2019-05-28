import { Component, OnInit } from '@angular/core';
import { DockerContainersService } from '../service/docker-containers.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-docker-shell-group',
  templateUrl: './docker-shell-group.component.html',
  styleUrls: ['./docker-shell-group.component.scss']
})
export class DockerShellGroupComponent implements OnInit {

  index = 0;
  tabs = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly containerService: DockerContainersService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(value => {
      const id = value.get('id');
      this.containerService.shellLength(id).subscribe(value => {
        if (value['msg'] === 'ok') {
          let num = value['data'];
          num = num === 0 ? 1 : num;
          console.log(num);
          for (let i = 0; i < num; ++i) {
            this.tabs.push(i + 1 + '');
          }
        }
      });
    }).unsubscribe();
  }

  closeTab(tab: string): void {
    this.tabs.splice(this.tabs.indexOf(tab), 1);
  }

  newTab(): void {
    this.tabs.push(this.tabs.length + 1 + '');
    this.index = this.tabs.length - 1;
  }
}
