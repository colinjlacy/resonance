import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionsBoxComponent } from './instructions-box.component';

describe('InstructionsBoxComponent', () => {
  let component: InstructionsBoxComponent;
  let fixture: ComponentFixture<InstructionsBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructionsBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
