import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeoverDialogFormComponent } from './takeover-dialog-form.component';

describe('TakeoverDialogFormComponent', () => {
  let component: TakeoverDialogFormComponent;
  let fixture: ComponentFixture<TakeoverDialogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeoverDialogFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeoverDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
