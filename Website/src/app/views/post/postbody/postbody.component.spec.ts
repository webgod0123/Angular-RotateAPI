import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostbodyComponent } from './postbody.component';

describe('PostbodyComponent', () => {
  let component: PostbodyComponent;
  let fixture: ComponentFixture<PostbodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostbodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostbodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
