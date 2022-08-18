import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRoomDetailsComponent } from './group-room-details.component';

describe('GroupRoomDetailsComponent', () => {
  let component: GroupRoomDetailsComponent;
  let fixture: ComponentFixture<GroupRoomDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupRoomDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupRoomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
