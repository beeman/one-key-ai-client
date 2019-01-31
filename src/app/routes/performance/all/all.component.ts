import { Component, OnInit, OnDestroy } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { Subscription } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit, OnDestroy {

  private readonly tag = AllComponent.name;

  constructor(private performanceService: PerformanceService, private logger: NGXLogger) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }
}
