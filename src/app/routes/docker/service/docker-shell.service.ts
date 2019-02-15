import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class DockerShellService {

  constructor(private readonly logger: NGXLogger) { }
}
