import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicoList } from './servico-list';

describe('ServicoList', () => {
  let component: ServicoList;
  let fixture: ComponentFixture<ServicoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicoList],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
