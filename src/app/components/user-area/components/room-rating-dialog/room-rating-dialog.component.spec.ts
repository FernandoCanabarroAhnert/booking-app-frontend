import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomRatingDialogComponent } from './room-rating-dialog.component';

describe('RoomRatingDialogComponent', () => {
  let component: RoomRatingDialogComponent;
  let fixture: ComponentFixture<RoomRatingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomRatingDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomRatingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
