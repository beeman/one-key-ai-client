import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockioComponent } from './blockio.component';

describe('BlockioComponent', () => {
  let component: BlockioComponent;
  let fixture: ComponentFixture<BlockioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
