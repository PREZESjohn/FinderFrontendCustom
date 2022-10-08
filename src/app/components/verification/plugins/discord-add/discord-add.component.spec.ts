import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscordAddComponent } from './discord-add.component';

describe('DiscordAddComponent', () => {
  let component: DiscordAddComponent;
  let fixture: ComponentFixture<DiscordAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscordAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscordAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
