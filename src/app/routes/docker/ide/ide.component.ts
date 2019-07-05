import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { EnvironmentService } from 'src/app/core/environment.service';

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
    private readonly environmentService: EnvironmentService
  ) { }

  ngOnInit() {
   
  }

  ngAfterViewInit(): void {
    const element = <HTMLDivElement>(this.containerRef.nativeElement);
    element.style.height = this.environmentService.getContainerHeight() + 'px';
  }

  onShellEvent(event: string): void {
    if (event === 'end') {
      this.location.back();
    }
  }


}
