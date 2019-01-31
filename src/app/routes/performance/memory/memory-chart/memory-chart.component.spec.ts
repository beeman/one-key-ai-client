import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoryChartComponent } from './memory-chart.component';

describe('MemoryComponent', () => {
  let component: MemoryChartComponent;
  let fixture: ComponentFixture<MemoryChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoryChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
