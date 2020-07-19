import {
  Directive,
  EventEmitter,
  ElementRef,
  Output,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appOutside]',
})
export class OutsideDirective {
  @Output()
  clickedOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.clickedOutside.emit();
    }
  }
}
