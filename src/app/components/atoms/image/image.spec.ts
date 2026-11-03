import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Image } from './image';

describe('Image Atom', () => {
  let fixture: ComponentFixture<Image>;
  let component: Image;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Image],
    }).compileComponents();

    fixture = TestBed.createComponent(Image);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('activa isLoaded y emite onLoad al completarse la carga', () => {
    let loadedEmitted = false;
    component.onLoad.subscribe(() => (loadedEmitted = true));

    fixture.componentRef.setInput('src', 'https://example.com/test.jpg');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    img.dispatchEvent(new Event('load'));
    fixture.detectChanges();

    expect(component.isLoaded()).toBe(true);
    expect(loadedEmitted).toBe(true);
    expect(img.classList.contains('loaded')).toBe(true);
  });

  it('usa imagen de respaldo y emite onError si la carga falla', () => {
    let errorEmitted = '';
    component.onError.subscribe((err) => (errorEmitted = err));

    fixture.componentRef.setInput('src', 'https://example.com/invalid.jpg');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(component.hasError()).toBe(true);
    expect(errorEmitted).toContain('Error');
    expect(component.getImageSrc()).toContain('data:image/svg+xml');
  });
});
