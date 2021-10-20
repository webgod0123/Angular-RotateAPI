import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RebuttalPageComponent } from './rebuttal-page.component';

describe('RebuttalPageComponent', () => {
  let component: RebuttalPageComponent;
  let fixture: ComponentFixture<RebuttalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RebuttalPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RebuttalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
