import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BaseFieldComponent } from '../base-field.component';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule],
  templateUrl: './text-field.component.html',
  host: { style: 'display: contents' },
  styles: [
    `
      :host {
        display: contents;
      }

      :host ::ng-deep mat-form-field.has-projected-prefix .mat-mdc-form-field-infix,
      :host ::ng-deep mat-form-field.has-projected-suffix .mat-mdc-form-field-infix {
        position: relative;
      }

      :host ::ng-deep mat-form-field.has-projected-prefix .mat-mdc-form-field-infix {
        padding-left: 48px;
      }

      :host ::ng-deep mat-form-field.has-projected-suffix .mat-mdc-form-field-infix {
        padding-right: 48px;
      }

      :host ::ng-deep mat-form-field.has-projected-prefix [matPrefix],
      :host ::ng-deep mat-form-field.has-projected-suffix [matSuffix] {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        line-height: 0;
      }

      :host ::ng-deep mat-form-field.has-projected-prefix [matPrefix] {
        left: 0;
      }

      :host ::ng-deep mat-form-field.has-projected-suffix [matSuffix] {
        right: 0;
      }

      :host ::ng-deep mat-form-field.has-projected-prefix [matPrefix] .mat-icon,
      :host ::ng-deep mat-form-field.has-projected-suffix [matSuffix] .mat-icon {
        width: 1em;
        height: 1em;
        font-size: inherit;
      }
    `,
  ],
})
export class TextFieldComponent extends BaseFieldComponent<string> {
  readonly type = input<'text' | 'password'>('text');
  readonly maxLength = input<number>();
  readonly minLength = input<number>();
  readonly suffixIcon = input<string | null>(null);
  readonly suffixClass = input<string>('');
  readonly suffixTooltip = input<string>('');
  readonly readOnly = input(false);
}
