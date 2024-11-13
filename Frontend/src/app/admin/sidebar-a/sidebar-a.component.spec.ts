import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAComponent } from './sidebar-a.component';

describe('SidebarAComponent', () => {
  let component: SidebarAComponent;
  let fixture: ComponentFixture<SidebarAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarAComponent]
    });
    fixture = TestBed.createComponent(SidebarAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
