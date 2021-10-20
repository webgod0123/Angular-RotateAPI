import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowerBipartMenuComponent } from './follower-bipart-menu.component';

describe('FollowerBipartMenuComponent', () => {
  let component: FollowerBipartMenuComponent;
  let fixture: ComponentFixture<FollowerBipartMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowerBipartMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowerBipartMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
