import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortFeedComponent } from './short-feed.component';

describe('ShortFeedComponent', () => {
  let component: ShortFeedComponent;
  let fixture: ComponentFixture<ShortFeedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShortFeedComponent]
    });
    fixture = TestBed.createComponent(ShortFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
