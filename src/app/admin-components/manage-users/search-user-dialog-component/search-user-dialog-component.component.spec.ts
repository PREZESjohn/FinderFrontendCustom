import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUserDialogComponentComponent } from './search-user-dialog-component.component';

describe('SearchUserDialogComponentComponent', () => {
  let component: SearchUserDialogComponentComponent;
  let fixture: ComponentFixture<SearchUserDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchUserDialogComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUserDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
