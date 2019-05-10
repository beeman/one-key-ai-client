import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DockerContainerStatsService } from '../service/docker-container-stats.service';

@Component({
  selector: 'app-container-stats',
  templateUrl: './container-stats.component.html',
  styleUrls: ['./container-stats.component.scss']
})
export class ContainerStatsComponent implements OnInit, OnDestroy {
  private statsSubscription = null;
  private data$ = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private readonly containerStatsService: DockerContainerStatsService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(value => {
      const id = value.get('id');
      this.statsSubscription = this.containerStatsService.getSimpleStats(id).subscribe(data => {
        this.data$.emit(data);
      });
    }).unsubscribe();

  }

  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }

}
