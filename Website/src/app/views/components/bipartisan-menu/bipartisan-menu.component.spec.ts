import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BipartisanMenuComponent } from './bipartisan-menu.component';

describe('BipartisanMenuComponent', () => {
  let component: BipartisanMenuComponent;
  let fixture: ComponentFixture<BipartisanMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BipartisanMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BipartisanMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
