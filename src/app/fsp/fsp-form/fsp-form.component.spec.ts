import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FspFormComponent } from './fsp-form.component';

describe('FspFormComponent', () => {
  let component: FspFormComponent;
  let fixture: ComponentFixture<FspFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FspFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FspFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
