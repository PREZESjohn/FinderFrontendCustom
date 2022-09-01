import { TestBed } from '@angular/core/testing';

import { MiniProfilOverlayService } from './mini-profil-overlay.service';

describe('MiniProfilOverlayService', () => {
  let service: MiniProfilOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiniProfilOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
