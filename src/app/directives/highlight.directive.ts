import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  private hovered = false;
  private focused = false;

  @HostBinding('class.cp-highlighted')
  get highlighted(): boolean {
    return this.hovered || this.focused;
  }

  @HostBinding('attr.tabindex') readonly tabIndex = 0;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.hovered = true;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hovered = false;
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.focused = true;
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this.focused = false;
  }
}
