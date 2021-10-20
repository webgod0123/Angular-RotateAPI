import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionhubComponent } from './discussionhub.component';

describe('DiscussionhubComponent', () => {
  let component: DiscussionhubComponent;
  let fixture: ComponentFixture<DiscussionhubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscussionhubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionhubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
