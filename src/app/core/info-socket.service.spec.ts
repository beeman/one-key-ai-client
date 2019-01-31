import { TestBed } from '@angular/core/testing';

import { InfoSocketService } from './info-socket.service';

describe('InfoSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InfoSocketService = TestBed.get(InfoSocketService);
    expect(service).toBeTruthy();
  });
});
