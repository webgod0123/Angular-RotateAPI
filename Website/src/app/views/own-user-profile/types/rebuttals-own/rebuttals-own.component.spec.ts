import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RebuttalsOwnComponent } from './rebuttals-own.component';

describe('RebuttalsOwnComponent', () => {
  let component: RebuttalsOwnComponent;
  let fixture: ComponentFixture<RebuttalsOwnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RebuttalsOwnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RebuttalsOwnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
