import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChatLogsComponent } from './user-chat-logs.component';

describe('UserChatLogsComponent', () => {
  let component: UserChatLogsComponent;
  let fixture: ComponentFixture<UserChatLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserChatLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChatLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
