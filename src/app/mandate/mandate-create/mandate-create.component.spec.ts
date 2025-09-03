import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateCreateComponent } from './mandate-create.component';

describe('MandateCreateComponent', () => {
  let component: MandateCreateComponent;
  let fixture: ComponentFixture<MandateCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MandateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
