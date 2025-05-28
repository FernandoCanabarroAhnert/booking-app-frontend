import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingPdfDialogComponent } from './booking-pdf-dialog.component';

describe('BookingPdfDialogComponent', () => {
  let component: BookingPdfDialogComponent;
  let fixture: ComponentFixture<BookingPdfDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingPdfDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingPdfDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
