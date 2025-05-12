import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDetailsFooterComponent } from './room-details-footer.component';

describe('RoomDetailsFooterComponent', () => {
  let component: RoomDetailsFooterComponent;
  let fixture: ComponentFixture<RoomDetailsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomDetailsFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomDetailsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
