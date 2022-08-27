import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRoomTableComponent } from './group-room-table.component';

describe('GroupRoomTableComponent', () => {
  let component: GroupRoomTableComponent;
  let fixture: ComponentFixture<GroupRoomTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupRoomTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupRoomTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
