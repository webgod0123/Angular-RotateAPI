import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RebuttalLandingComponent } from './rebuttal-landing.component';

describe('RebuttalLandingComponent', () => {
  let component: RebuttalLandingComponent;
  let fixture: ComponentFixture<RebuttalLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RebuttalLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RebuttalLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
