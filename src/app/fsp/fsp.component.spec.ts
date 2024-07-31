import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FspComponent } from './fsp.component';

describe('FspComponent', () => {
  let component: FspComponent;
  let fixture: ComponentFixture<FspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FspComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
