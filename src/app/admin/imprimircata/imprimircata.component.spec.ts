import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimircataComponent } from './imprimircata.component';

describe('ImprimircataComponent', () => {
  let component: ImprimircataComponent;
  let fixture: ComponentFixture<ImprimircataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImprimircataComponent]
    });
    fixture = TestBed.createComponent(ImprimircataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
