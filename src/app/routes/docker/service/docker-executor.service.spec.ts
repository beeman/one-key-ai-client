import { TestBed } from '@angular/core/testing';

import { DockerExecutorService } from './docker-executor.service';

describe('DockerExecutorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DockerExecutorService = TestBed.get(DockerExecutorService);
    expect(service).toBeTruthy();
  });
});
