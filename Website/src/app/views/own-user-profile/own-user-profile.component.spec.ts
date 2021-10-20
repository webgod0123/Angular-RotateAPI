import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnUserProfileComponent } from './own-user-profile.component';

describe('OwnUserProfileComponent', () => {
  let component: OwnUserProfileComponent;
  let fixture: ComponentFixture<OwnUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnUserProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
