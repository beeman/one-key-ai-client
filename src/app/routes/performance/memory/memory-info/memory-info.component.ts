import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-memory-info',
  templateUrl: './memory-info.component.html',
  styleUrls: ['./memory-info.component.scss']
})
export class MemoryInfoComponent implements OnInit {

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
      case 'total': return '物理内存';
      case 'used': return '使用内存';
      case 'free': return '空闲内存';
      case 'buffers': return '缓存内存';
      default: return name;
    }
  }
}
