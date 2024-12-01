import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavAComponent } from './nav-a.component';

describe('NavAComponent', () => {
  let component: NavAComponent;
  let fixture: ComponentFixture<NavAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavAComponent]
    });
    fixture = TestBed.createComponent(NavAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
