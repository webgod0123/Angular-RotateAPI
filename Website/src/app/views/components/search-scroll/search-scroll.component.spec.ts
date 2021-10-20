import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchScrollComponent } from './search-scroll.component';

describe('SearchScrollComponent', () => {
  let component: SearchScrollComponent;
  let fixture: ComponentFixture<SearchScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchScrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
