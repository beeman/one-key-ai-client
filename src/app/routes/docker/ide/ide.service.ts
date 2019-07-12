import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdeService {
  private languages: monaco.languages.ILanguageExtensionPoint[] = [];
  private lauguageIds: string[] = [];

  private event$: EventEmitter<any> = new EventEmitter();
  private projectMap: string[] = [];

  constructor() { }

  public changeToContainerPath(systemPath: string): string {
    if (this.projectMap && this.projectMap.length === 2) {
      const systemRoot = this.projectMap[0];
      const containerRoot = this.projectMap[1];

      if (systemPath.startsWith(systemPath)) {
        return containerRoot + systemPath.slice(systemRoot.length);
      }
    }
    
    return '';
  }

  public getEvent(): EventEmitter<any> {
    return this.event$;
  }

  public getLanguages(): monaco.languages.ILanguageExtensionPoint[] {
    return this.languages;
  }

  public getLanguageIds(): string[] {
    return this.lauguageIds;
  }

  public getProjectMap(): string[] {
    return this.projectMap;
  }

  public setLanguages(languages: monaco.languages.ILanguageExtensionPoint[]): void {
    this.languages = languages;

    this.languages.forEach(value => {
      this.lauguageIds.push(value.id);
    });

    // console.log(this.languages);
  }

  public setProjectMap(map: string[]) {
    this.projectMap = map;

    this.event$.emit({ event: 'projectMapChanged', data: this.projectMap });
  }

  public suggestLanguageId(filePath: string): string {
    const items = filePath.split('.');
    const extension = items[items.length - 1];

    const language = this.findLanguage('.' + extension);
    if (language) {
      return language.id;
    } else {
      return 'plaintext';
    }
  }

  // private getFileName(filePath: string): string {
  //   const items = filePath.split('/');
  //   return items[items.length - 1];
  // }

  private findLanguage(extension: string): monaco.languages.ILanguageExtensionPoint {
    const index = this.languages.findIndex(language => {
      return language.extensions.indexOf(extension) >= 0;
    });

    if (index >= 0) {
      return this.languages[index];
    } else {
      return null;
    }
  }
}
