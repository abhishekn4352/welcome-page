import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllnewdashComponent } from './allnewdash.component';

describe('AllnewdashComponent', () => {
  let component: AllnewdashComponent;
  let fixture: ComponentFixture<AllnewdashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllnewdashComponent]
    });
    fixture = TestBed.createComponent(AllnewdashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
