import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import * as Docker from 'dockerode';
import { map } from 'rxjs/operators';
import { ContainerStats } from 'src/app/shared/charts/container-stats';


@Injectable({
  providedIn: 'root'
})
export class DockerContainerStatsService {

  constructor() { }

  public getDetailedStats(id: string): Observable<Docker.ContainerStats> {
    return new Observable(observer => {
      const socket = io(environment.serverUrl);
      socket.on('connect', () => {
        socket.emit('containerStats', id);
        socket.on('stats', (data: string) => {
          observer.next(<Docker.ContainerStats>(JSON.parse(data)));
        });
      });
      socket.on('disconnect', () => {
        observer.complete();
      });

      return {
        unsubscribe: () => {
          socket.disconnect();
        }
      };
    });
  }

  public getSimpleStats(id: string): Observable<ContainerStats> {
    return this.getDetailedStats(id).pipe(
      map(value => {
        return this.parseStats(value);
      })
    );
  }

  private parseStats(stats: Docker.ContainerStats): ContainerStats {
    return <ContainerStats>{
      cpu: this.calculateCPUPercentUnix(stats),
      io: this.calculateBlockIO(stats),
      network: this.calculateNetwork(stats),
      mem: this.calculateMem(stats),
      pidsStats: this.calculatePids(stats),
      time: this.calculateTime(stats)
    };
  }

  private calculateTime(stats: Docker.ContainerStats): Date {
    return new Date(stats.read);
    // const time = new Date(stats.read);
    // return [time.getHours(), time.getMinutes(), time.getSeconds()].join(':');
  }

  private calculatePids(stats: Docker.ContainerStats): { current: number } {
    const pidsStats = stats['pid_stats'] ? stats['pid_stats'] : stats['pids_stats'];

    return pidsStats;
  }

  private calculateMem(stats: Docker.ContainerStats): { memUsage: number, limit: number } {
    const memStats = stats.memory_stats;
    const memUsage = memStats.usage - memStats.stats.cache;

    return { memUsage: memUsage, limit: memStats.limit };
  }

  private calculateCPUPercentUnix(stats: Docker.ContainerStats): number {
    const previousCPU = stats.precpu_stats.cpu_usage.total_usage;
    const previousSystem = stats.precpu_stats.system_cpu_usage;
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - previousCPU;
    const systemDelta = stats.cpu_stats.system_cpu_usage - previousSystem;
    let cpuPercent = 0.0;
    if (systemDelta > 0.0 && cpuDelta > 0.0) {
      cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.cpu_usage.percpu_usage.length * 100.0;
    }

    return Number.parseFloat(cpuPercent.toFixed(2));
  }

  // func calculateCPUPercentWindows(v *types.StatsJSON) float64 {
  //   // Max number of 100ns intervals between the previous time read and now
  //   possIntervals := uint64(v.Read.Sub(v.PreRead).Nanoseconds()) // Start with number of ns intervals
  //   possIntervals /= 100                                         // Convert to number of 100ns intervals
  //   possIntervals *= uint64(v.NumProcs)                          // Multiple by the number of processors

  //   // Intervals used
  //   intervalsUsed := v.CPUStats.CPUUsage.TotalUsage - v.PreCPUStats.CPUUsage.TotalUsage

  //   // Percentage avoiding divide-by-zero
  //   if possIntervals > 0 {
  //     return float64(intervalsUsed) / float64(possIntervals) * 100.0
  //   }
  //   return 0.00
  // }

  private calculateBlockIO(stats: Docker.ContainerStats): { blockReadBytes: number, blockWriteBytes: number } {
    const ioServiceBytesRecursive: any[] = stats.blkio_stats['io_service_bytes_recursive'];

    let blkRead = 0;
    let blkWrite = 0;

    if (ioServiceBytesRecursive) {
      ioServiceBytesRecursive.forEach(bioEntry => {
        switch (bioEntry.op) {
          case 'Read': blkRead += bioEntry.value; break;
          case 'Write': blkWrite += bioEntry.value; break;
          default: break;
        }
      });
    }

    return { blockReadBytes: blkRead, blockWriteBytes: blkWrite };
  }

  private calculateNetwork(stats: Docker.ContainerStats): { receiveBytes: number, transportBytes: number } {
    let rx = 0;
    let tx = 0;

    const networks = stats.networks;
    Object.values(networks).forEach(value => {
      rx += value.rx_bytes;
      tx += value.tx_bytes;
    });

    return { receiveBytes: rx, transportBytes: tx };
  }

}
