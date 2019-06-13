import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit, OnDestroy {
  public data$ = new EventEmitter();

  private statsSubscription: Subscription = null;

  // private readonly tag = AllComponent.name;

  constructor(
    private performanceService: PerformanceService,
  ) { }

  ngOnInit() {
    this.statsSubscription = this.performanceService.getStats().subscribe(data => {
      this.data$.emit(data);
    });
  }

  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }
}
