import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyBoxComponent } from './reply-box.component';

describe('ReplyBoxComponent', () => {
  let component: ReplyBoxComponent;
  let fixture: ComponentFixture<ReplyBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplyBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
