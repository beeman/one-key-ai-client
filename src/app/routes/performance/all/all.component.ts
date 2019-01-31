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

  public text: string;
  private subscription: Subscription = null;
  private readonly tag = AllComponent.name;

  constructor(private performanceService: PerformanceService, private logger: NGXLogger) { }

  ngOnInit() {
    this.startGetMessage();
  }

  ngOnDestroy(): void {
    this.stopGetMessage();
  }

  public startGetMessage() {
    this.subscription = this.performanceService.getMessage().subscribe((data) => {
      this.text = JSON.stringify(data);
    });
  }

  public stopGetMessage() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
