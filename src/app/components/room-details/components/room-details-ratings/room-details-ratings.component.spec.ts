import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDetailsRatingsComponent } from './room-details-ratings.component';

describe('RoomDetailsRatingsComponent', () => {
  let component: RoomDetailsRatingsComponent;
  let fixture: ComponentFixture<RoomDetailsRatingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomDetailsRatingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomDetailsRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
