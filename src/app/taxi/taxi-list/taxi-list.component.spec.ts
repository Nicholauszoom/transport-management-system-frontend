import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiListComponent } from './taxi-list.component';

describe('TaxiListComponent', () => {
  let component: TaxiListComponent;
  let fixture: ComponentFixture<TaxiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
