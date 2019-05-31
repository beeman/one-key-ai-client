import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceStatsService } from 'src/app/core/device-stats.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gpu',
  templateUrl: './gpu.component.html',
  styleUrls: ['./gpu.component.scss']
})
export class GpuComponent implements OnInit, OnDestroy {
  stats = null;

  private statsSubscription: Subscription = null;

  constructor(
    private readonly deviceStatsService: DeviceStatsService
  ) { }

  ngOnInit() {
    this.statsSubscription = this.deviceStatsService.getStats().subscribe((data: any) => {
      this.stats = JSON.stringify(data);
      console.log(data);
    });
  }

  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }
}
