import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PidsComponent } from './pids.component';

describe('PidsComponent', () => {
  let component: PidsComponent;
  let fixture: ComponentFixture<PidsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PidsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
