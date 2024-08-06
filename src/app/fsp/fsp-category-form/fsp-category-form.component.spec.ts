import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FspCategoryFormComponent } from './fsp-category-form.component';

describe('FspCategoryFormComponent', () => {
  let component: FspCategoryFormComponent;
  let fixture: ComponentFixture<FspCategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FspCategoryFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FspCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
