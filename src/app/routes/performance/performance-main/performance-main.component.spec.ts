import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceMainComponent } from './performance-main.component';

describe('PerformanceMainComponent', () => {
  let component: PerformanceMainComponent;
  let fixture: ComponentFixture<PerformanceMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
