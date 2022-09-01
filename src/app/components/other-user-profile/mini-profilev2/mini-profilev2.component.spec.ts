import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniProfilev2Component } from './mini-profilev2.component';

describe('MiniProfilev2Component', () => {
  let component: MiniProfilev2Component;
  let fixture: ComponentFixture<MiniProfilev2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniProfilev2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniProfilev2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
