import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCarComponent } from './list-car.component';

describe('ListCarComponent', () => {
  let component: ListCarComponent;
  let fixture: ComponentFixture<ListCarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCarComponent]
    });
    fixture = TestBed.createComponent(ListCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
