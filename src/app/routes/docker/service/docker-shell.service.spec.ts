import { TestBed } from '@angular/core/testing';

import { DockerShellService } from './docker-shell.service';

describe('DockerShellService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DockerShellService = TestBed.get(DockerShellService);
    expect(service).toBeTruthy();
  });
});
