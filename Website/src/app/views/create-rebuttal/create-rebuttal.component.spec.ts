import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRebuttalComponent } from './create-rebuttal.component';

describe('CreateRebuttalComponent', () => {
  let component: CreateRebuttalComponent;
  let fixture: ComponentFixture<CreateRebuttalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRebuttalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRebuttalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
