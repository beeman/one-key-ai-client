import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private headerHeight: number = 64;

  constructor() { }

  public serverUrl(): string {
    return environment.serverUrl;
  }

  public getHeaderHeight(): number {
    return this.headerHeight;
  }

  public setHeaderHeight(height: number): void {
    this.headerHeight = height;
  }

  public getContainerHeight(): number {
    return this.getClientHeight() - this.getHeaderHeight();
  }

  private getClientHeight() {
    return Math.max(document.body.clientHeight, document.documentElement.clientHeight);
  }
}
