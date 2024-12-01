import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterAComponent } from './footer-a.component';

describe('FooterAComponent', () => {
  let component: FooterAComponent;
  let fixture: ComponentFixture<FooterAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterAComponent]
    });
    fixture = TestBed.createComponent(FooterAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
