import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoryInfoComponent } from './memory-info.component';

describe('MemoryInfoComponent', () => {
  let component: MemoryInfoComponent;
  let fixture: ComponentFixture<MemoryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoryInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
