import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatLogsDialogComponent } from './group-chat-logs-dialog.component';

describe('GroupChatLogsDialogComponent', () => {
  let component: GroupChatLogsDialogComponent;
  let fixture: ComponentFixture<GroupChatLogsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupChatLogsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatLogsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
