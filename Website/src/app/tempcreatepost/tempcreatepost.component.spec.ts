import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempcreatepostComponent } from './tempcreatepost.component';

describe('TempcreatepostComponent', () => {
  let component: TempcreatepostComponent;
  let fixture: ComponentFixture<TempcreatepostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TempcreatepostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TempcreatepostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
