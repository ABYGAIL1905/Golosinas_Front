import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimircatalogoComponent } from './imprimircatalogo.component';

describe('ImprimircatalogoComponent', () => {
  let component: ImprimircatalogoComponent;
  let fixture: ComponentFixture<ImprimircatalogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImprimircatalogoComponent]
    });
    fixture = TestBed.createComponent(ImprimircatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
