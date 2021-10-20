import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionCardComponent } from './discussion-card.component';

describe('DiscussionCardComponent', () => {
  let component: DiscussionCardComponent;
  let fixture: ComponentFixture<DiscussionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscussionCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
