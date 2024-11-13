import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetCarComponent } from './det-car.component';

describe('DetCarComponent', () => {
  let component: DetCarComponent;
  let fixture: ComponentFixture<DetCarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetCarComponent]
    });
    fixture = TestBed.createComponent(DetCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
