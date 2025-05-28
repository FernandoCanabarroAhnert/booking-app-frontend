import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreditCardsComponent } from './user-credit-cards.component';

describe('UserCreditCardsComponent', () => {
  let component: UserCreditCardsComponent;
  let fixture: ComponentFixture<UserCreditCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreditCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserCreditCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
