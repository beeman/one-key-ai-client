import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cpu-info',
  templateUrl: './cpu-info.component.html',
  styleUrls: ['./cpu-info.component.scss']
})
export class CpuInfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  private parseInfo(data: any): any[] {
    const info = [];

    for (const key in data) {
      info.push({ 'name': this.parseCpuName(key), 'value': data[key] });
    }

    return info;
  }

  private parseCpuName(name: string): string {
    switch (name) {
      case 'us': return '用户空间占用CPU的百分比';
      case 'sy': return '内核空间占用CPU的百分比';
      case 'ni': return '改变过优先级的进程占用CPU的百分比';
      case 'id': return '空闲CPU百分比';
      case 'wa': return 'IO等待占用CPU的百分比';
      case 'hi': return '硬中断占用CPU的百分比';
      case 'si': return '软中断占用CPU的百分比';
      case 'st': return '虚拟机被hypervisor偷去的CPU时间';
      default: return name;
    }
  }
}
