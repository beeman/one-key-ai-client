import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DockerShellComponent } from './docker-shell.component';

describe('DockerShellComponent', () => {
  let component: DockerShellComponent;
  let fixture: ComponentFixture<DockerShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DockerShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockerShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
