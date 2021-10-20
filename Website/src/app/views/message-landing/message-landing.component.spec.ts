import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageLandingComponent } from './message-landing.component';

describe('MessageLandingComponent', () => {
  let component: MessageLandingComponent;
  let fixture: ComponentFixture<MessageLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
