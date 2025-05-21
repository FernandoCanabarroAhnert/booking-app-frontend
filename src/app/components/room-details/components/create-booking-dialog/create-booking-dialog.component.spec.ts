import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBookingDialogComponent } from './create-booking-dialog.component';

describe('CreateBookingDialogComponent', () => {
  let component: CreateBookingDialogComponent;
  let fixture: ComponentFixture<CreateBookingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBookingDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateBookingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
