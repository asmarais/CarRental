import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsAComponent } from './maps-a.component';

describe('MapsAComponent', () => {
  let component: MapsAComponent;
  let fixture: ComponentFixture<MapsAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapsAComponent]
    });
    fixture = TestBed.createComponent(MapsAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
