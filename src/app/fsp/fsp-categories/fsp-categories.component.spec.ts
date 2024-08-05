import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FspCategoriesComponent } from './fsp-categories.component';

describe('FspCategoriesComponent', () => {
  let component: FspCategoriesComponent;
  let fixture: ComponentFixture<FspCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FspCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FspCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
