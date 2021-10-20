import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RebuttalCardComponent } from './rebuttal-card.component';

describe('RebuttalCardComponent', () => {
  let component: RebuttalCardComponent;
  let fixture: ComponentFixture<RebuttalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RebuttalCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RebuttalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
