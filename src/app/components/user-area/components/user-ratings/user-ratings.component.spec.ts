import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRatingsComponent } from './user-ratings.component';

describe('UserRatingsComponent', () => {
  let component: UserRatingsComponent;
  let fixture: ComponentFixture<UserRatingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRatingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
