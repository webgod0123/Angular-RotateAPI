import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RebuttalsUserComponent } from './rebuttals-user.component';

describe('RebuttalsUserComponent', () => {
  let component: RebuttalsUserComponent;
  let fixture: ComponentFixture<RebuttalsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RebuttalsUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RebuttalsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
