import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostScrollComponent } from './post-scroll.component';

describe('PostScrollComponent', () => {
  let component: PostScrollComponent;
  let fixture: ComponentFixture<PostScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostScrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
