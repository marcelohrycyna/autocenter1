import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CidadeEdit } from './cidade-edit';

describe('CidadeEdit', () => {
  let component: CidadeEdit;
  let fixture: ComponentFixture<CidadeEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CidadeEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(CidadeEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
