import { TestBed } from '@angular/core/testing';
import { IconSearch, IconX, provideTablerIcons } from '@tabler/icons-angular';
import { SearchForm } from './search-form';

describe('SearchForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchForm],
      providers: [provideTablerIcons({ IconSearch, IconX })],
    }).compileComponents();
  });

  it('sincroniza el término local cuando cambia searchTerm', () => {
    const fixture = TestBed.createComponent(SearchForm);

    fixture.componentRef.setInput('searchTerm', 'auriculares');
    fixture.detectChanges();

    expect(fixture.componentInstance.localTerm()).toBe('auriculares');
  });

  it('permite escribir un término nuevo sin perderlo', () => {
    const fixture = TestBed.createComponent(SearchForm);
    fixture.detectChanges();

    fixture.componentInstance.handleInputChange('ropa');
    fixture.detectChanges();

    expect(fixture.componentInstance.localTerm()).toBe('ropa');
  });
});
