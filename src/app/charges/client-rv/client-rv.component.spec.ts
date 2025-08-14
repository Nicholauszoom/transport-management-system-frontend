import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRvComponent } from './client-rv.component';

describe('ClientRvComponent', () => {
  let component: ClientRvComponent;
  let fixture: ComponentFixture<ClientRvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientRvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientRvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
