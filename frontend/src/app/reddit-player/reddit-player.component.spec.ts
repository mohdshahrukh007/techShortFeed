import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedditPlayerComponent } from './reddit-player.component';

describe('RedditPlayerComponent', () => {
  let component: RedditPlayerComponent;
  let fixture: ComponentFixture<RedditPlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RedditPlayerComponent]
    });
    fixture = TestBed.createComponent(RedditPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
