import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TexteditorComponent } from './texteditor.component';

describe('TexteditorComponent', () => {
  let component: TexteditorComponent;
  let fixture: ComponentFixture<TexteditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TexteditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TexteditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
