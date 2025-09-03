import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateViewComponent } from './mandate-view.component';

describe('MandateViewComponent', () => {
  let component: MandateViewComponent;
  let fixture: ComponentFixture<MandateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MandateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
