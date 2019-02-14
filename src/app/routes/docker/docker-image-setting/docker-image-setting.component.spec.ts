import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DockerImageSettingComponent } from './docker-image-setting.component';

describe('DockerImageSettingComponent', () => {
  let component: DockerImageSettingComponent;
  let fixture: ComponentFixture<DockerImageSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DockerImageSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockerImageSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
