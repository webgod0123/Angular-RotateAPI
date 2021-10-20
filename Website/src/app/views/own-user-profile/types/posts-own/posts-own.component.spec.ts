import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsOwnComponent } from './posts-own.component';

describe('PostsOwnComponent', () => {
  let component: PostsOwnComponent;
  let fixture: ComponentFixture<PostsOwnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostsOwnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsOwnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
