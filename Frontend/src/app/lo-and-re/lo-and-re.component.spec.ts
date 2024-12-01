import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoAndReComponent } from './lo-and-re.component';

describe('LoAndReComponent', () => {
  let component: LoAndReComponent;
  let fixture: ComponentFixture<LoAndReComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoAndReComponent]
    });
    fixture = TestBed.createComponent(LoAndReComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
