import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private headerHeight: number = 64;
  private browserVersion: any;

  constructor() {
    this.browserVersion = this.browse();
  }

  public serverUrl(): string {
    return environment.serverUrl;
  }

  public getHeaderHeight(): number {
    return this.headerHeight;
  }

  public setHeaderHeight(height: number): void {
    this.headerHeight = height;
  }

  public getBrowserVersion(): {} {
    return this.browserVersion;
  }

  public getContainerHeight(): number {
    return this.getClientHeight() - this.getHeaderHeight();
  }

  private getClientHeight() {
    return Math.max(document.body.clientHeight, document.documentElement.clientHeight);
  }

  private browse() {
    const browser: any = {};
    const userAgent = navigator.userAgent.toLowerCase();
    let s = null;
    (s = userAgent.match(/msie ([\d.]+)/)) ? browser.ie = s[1] : (s = userAgent.match(/firefox\/([\d.]+)/)) ? browser.firefox = s[1] : (s = userAgent.match(/chrome\/([\d.]+)/)) ? browser.chrome = s[1] : (s = userAgent.match(/opera.([\d.]+)/)) ? browser.opera = s[1] : (s = userAgent.match(/version\/([\d.]+).*safari/)) ? browser.safari = s[1] : 0;
    let version = {};
    if (browser.ie) {
      version['IE'] = browser.ie;
      // version = 'IE ' + browser.ie;
    }
    else {
      if (browser.firefox) {
        version['firefox'] = browser.firefox;
        // version = 'firefox ' + browser.firefox;
      }
      else {
        if (browser.chrome) {
          version['chrome'] = browser.chrome;
          // version = 'chrome ' + browser.chrome;
        }
        else {
          if (browser.opera) {
            version['opera'] = browser.opera;
            // version = 'opera ' + browser.opera;
          }
          else {
            if (browser.safari) {
              version['safari'] = browser.safari;
              // version = 'safari ' + browser.safari;
            }
            else {
              version['unknown'] = null;
            }
          }
        }
      }
    }
    return version;
  }

}
