import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DockerimageShellComponent } from './dockerimage-shell.component';

describe('DockerimageShellComponent', () => {
  let component: DockerimageShellComponent;
  let fixture: ComponentFixture<DockerimageShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DockerimageShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockerimageShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
