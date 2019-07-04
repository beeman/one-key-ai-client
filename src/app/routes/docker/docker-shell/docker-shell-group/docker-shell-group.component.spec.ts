import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DockerShellGroupComponent } from './docker-shell-group.component';

describe('DockerShellGroupComponent', () => {
  let component: DockerShellGroupComponent;
  let fixture: ComponentFixture<DockerShellGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DockerShellGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockerShellGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
