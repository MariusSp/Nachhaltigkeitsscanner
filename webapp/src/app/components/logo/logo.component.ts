import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <div
      class="logo cursor-pointer"
      [ngClass]="color"
      fxLayoutAlign="center center"
      [routerLink]="'/welcome'"
    >
      <mat-icon class="font logo-icon">compost</mat-icon>
      <span *ngIf="showText" class="font text">NHS</span>
    </div>
  `,
  styles: [
    `
      .logo {
        height: var(--logo-height);
      }
      .logo-icon {
        height: var(--logo-height);
        width: var(--logo-height);
      }
      .font {
        font-size: var(--logo-height);
        line-height: var(--logo-height);
      }
      .text {
        font-family: 'Impact';
      }
    `,
  ],
})
export class LogoComponent implements OnInit {
  @HostBinding('style.--logo-height') private value: string;
  @Input() set height(height: number | string) {
    if (typeof height == 'string') {
      this.value = height;
    } else {
      this.value = height + 'px';
    }
  }
  @Input() showText: boolean = true;
  @Input() color: 'primary' | 'primary-contrast' | 'accent' | 'accent-contrast';
  constructor() {}

  ngOnInit(): void {}
}
