import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculoPrecoComponent } from './calculo-preco.component';

describe('CalculoPrecoComponent', () => {
  let component: CalculoPrecoComponent;
  let fixture: ComponentFixture<CalculoPrecoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculoPrecoComponent]
    });
    fixture = TestBed.createComponent(CalculoPrecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
