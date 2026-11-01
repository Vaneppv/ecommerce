import { Directive, ElementRef, inject, OnDestroy, OnInit, output } from '@angular/core';

@Directive({ selector: '[appInfiniteScroll]' })
export class InfiniteScroll implements OnInit, OnDestroy {
  readonly reached = output<void>();

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  ngOnInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.reached.emit();
        }
      },
      { rootMargin: '300px' },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
