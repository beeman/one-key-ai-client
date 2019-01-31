import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpuInfoComponent } from './cpu-info.component';

describe('CpuInfoComponent', () => {
  let component: CpuInfoComponent;
  let fixture: ComponentFixture<CpuInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpuInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpuInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
