import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteErrorPageComponent } from './route-error-page.component';

describe('RouteErrorPageComponent', () => {
  let component: RouteErrorPageComponent;
  let fixture: ComponentFixture<RouteErrorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteErrorPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RouteErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
