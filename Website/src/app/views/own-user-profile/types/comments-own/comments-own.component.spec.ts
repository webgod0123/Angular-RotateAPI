import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsOwnComponent } from './comments-own.component';

describe('CommentsOwnComponent', () => {
  let component: CommentsOwnComponent;
  let fixture: ComponentFixture<CommentsOwnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentsOwnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsOwnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
