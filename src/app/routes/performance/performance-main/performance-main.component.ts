import { Component, OnInit, OnDestroy } from '@angular/core';
import { PerformanceService } from '../performance.service';

@Component({
  selector: 'app-performance-main',
  templateUrl: './performance-main.component.html',
  styleUrls: ['./performance-main.component.scss']
})
export class PerformanceMainComponent implements OnInit, OnDestroy {

  constructor(private performanceService: PerformanceService) { }

  ngOnInit() {
    this.performanceService.startGetMessage();
  }

  ngOnDestroy() {
    this.performanceService.stopGetMessage();
  }

}
