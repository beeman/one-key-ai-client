import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdeService {
  private openFileEvent$: EventEmitter<string> = new EventEmitter();

  constructor() { }

  public getOpenFileEvent(): EventEmitter<string> {
    return this.openFileEvent$;
  }
}
