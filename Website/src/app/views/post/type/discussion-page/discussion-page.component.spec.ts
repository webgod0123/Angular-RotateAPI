import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionPageComponent } from './discussion-page.component';

describe('DiscussionPageComponent', () => {
  let component: DiscussionPageComponent;
  let fixture: ComponentFixture<DiscussionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscussionPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
