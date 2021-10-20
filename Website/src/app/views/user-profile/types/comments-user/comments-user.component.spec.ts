import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsUserComponent } from './comments-user.component';

describe('CommentsUserComponent', () => {
  let component: CommentsUserComponent;
  let fixture: ComponentFixture<CommentsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentsUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
