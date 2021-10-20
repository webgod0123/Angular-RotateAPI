import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSearchCardComponent } from './post-search-card.component';

describe('PostSearchCardComponent', () => {
  let component: PostSearchCardComponent;
  let fixture: ComponentFixture<PostSearchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostSearchCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostSearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
