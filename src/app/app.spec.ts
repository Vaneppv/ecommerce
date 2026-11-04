import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  IconCategory,
  IconChevronLeft,
  IconChevronRight,
  IconHome,
  IconLayoutGrid,
  IconShoppingCart,
  IconUser,
  provideTablerIcons,
} from '@tabler/icons-angular';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideTablerIcons({
          IconCategory,
          IconChevronLeft,
          IconChevronRight,
          IconHome,
          IconLayoutGrid,
          IconShoppingCart,
          IconUser,
        }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the header', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('header')).toBeTruthy();
  });
});
