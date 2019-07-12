import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { EnvironmentService } from 'src/app/core/environment.service';
import { ActivatedRoute } from '@angular/router';
import { DockerContainersService } from '../service/docker-containers.service';
import { IdeService } from './ide.service';

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.scss']
})
export class IdeComponent implements OnInit {
  @ViewChild('container', { static: false })
  containerRef: ElementRef;

  constructor(
    private readonly location: Location,
    private readonly environmentService: EnvironmentService,
    private readonly route: ActivatedRoute,
    private readonly dockerContainerService: DockerContainersService,
    private readonly ideService: IdeService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(value => {
      const id = value.get('id');
      this.dockerContainerService.configVolumes(id).subscribe(value => {
        if (!value['data']) {
          return;
        }
        if (value['msg'] === 'ok') {
          const items: string[] = value['data'];
          const keyWrods = `docker/projects`;
          for (let i = 0; i < items.length; ++i) {
            const item = items[i];
            const words = item.split(':');
            if (words.length === 2 && words[0].indexOf(keyWrods) >= 0) {
              // this.projectPaths = words[1].split('/');
              this.ideService.setProjectMap(words);
              break;
            }
          }
        }
      });
    }).unsubscribe();
  }

  ngAfterViewInit(): void {
    const element = <HTMLDivElement>(this.containerRef.nativeElement);
    element.style.height = this.environmentService.getContainerHeight() + 'px';
  }

  onShellEvent(event: string): void {
    if (event === 'end') {
      // this.location.back();
    }
  }


}
