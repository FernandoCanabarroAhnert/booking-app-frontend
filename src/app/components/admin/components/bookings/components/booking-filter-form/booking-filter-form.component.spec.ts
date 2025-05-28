import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFilterFormComponent } from './booking-filter-form.component';

describe('BookingFilterFormComponent', () => {
  let component: BookingFilterFormComponent;
  let fixture: ComponentFixture<BookingFilterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingFilterFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
