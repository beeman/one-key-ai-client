import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, ViewRef, ViewChild, ElementRef } from '@angular/core';
import { DockerContainersService } from '../../service/docker-containers.service';
import { ActivatedRoute } from '@angular/router';
import { DockerShellComponent } from '../docker-shell.component';

@Component({
  selector: 'app-docker-shell-group',
  templateUrl: './docker-shell-group.component.html',
  styleUrls: ['./docker-shell-group.component.scss']
})
export class DockerShellGroupComponent implements OnInit, AfterViewInit {
  @ViewChildren(DockerShellComponent)
  dockerShellGroup: QueryList<DockerShellComponent>;

  @ViewChild('tabset')
  tabsetRef: any;

  index = 0;
  tabs = [];

  private shellContainerElement: HTMLElement = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly containerService: DockerContainersService
  ) { }

  ngAfterViewInit() {

    setTimeout(() => {
      const element = this.tabsetRef.elementRef.nativeElement;
      const wholeHeight = element.clientHeight;
      // const topHeight = element.firstElementChild.clientHeight;
      const offsetTop = element.lastChild.offsetTop;
      const targetHeight = wholeHeight - offsetTop + 'px';

      this.shellContainerElement = element.lastChild;
      this.shellContainerElement.style.height = targetHeight;

      const children: HTMLCollection = element.lastChild.children;
      for (let i = 0; i < children.length; ++i) {
        const element = <HTMLElement>(children[i]);
        element.style.height = targetHeight;
      }
    }, 0);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(value => {
      const id = value.get('id');
      this.containerService.shellLength(id).subscribe(value => {
        if (value['msg'] === 'ok') {
          let num = value['data'];
          num = num === 0 ? 1 : num;
          for (let i = 0; i < num; ++i) {
            this.newTab();
          }
        }
      });
    }).unsubscribe();
  }

  // closeTab(tab: string): void {
  //   this.closeTabIndex(this.tabs.indexOf(tab));
  // }

  closeTabIndex(index: number): void {
    this.tabs.splice(index, 1);

    setTimeout(() => {
      this.selectedIndexChange(this.index);
    }, 0);
  }

  newTab(): void {
    this.tabs.push(this.tabs.length + 1 + '');
    this.index = this.tabs.length - 1;

    setTimeout(() => {
      if (this.shellContainerElement) {
        const element = <HTMLElement>(this.shellContainerElement.children[this.index]);
        element.style.height = this.shellContainerElement.style.height;
      }
    }, 0);

  }

  selectedIndexChange(index: number) {
    const shell = this.dockerShellGroup.find((item, i, array) => {
      return i === index;
    });
    if (shell) {
      shell.resize(this.shellContainerElement.clientWidth, this.shellContainerElement.clientHeight);
      shell.attachTerminalDom();
    }
  }

  onShellEvent(event: string) {
    if (event === 'end') {
      this.closeTabIndex(this.index);
    }
  }
}
