import { TestBed } from '@angular/core/testing';

import { GroupRoomService } from './group-room.service';

describe('GroupRoomService', () => {
  let service: GroupRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
