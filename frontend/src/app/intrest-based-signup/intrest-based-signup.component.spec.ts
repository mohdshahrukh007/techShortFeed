import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntrestBasedSignupComponent } from './intrest-based-signup.component';

describe('IntrestBasedSignupComponent', () => {
  let component: IntrestBasedSignupComponent;
  let fixture: ComponentFixture<IntrestBasedSignupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntrestBasedSignupComponent]
    });
    fixture = TestBed.createComponent(IntrestBasedSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
