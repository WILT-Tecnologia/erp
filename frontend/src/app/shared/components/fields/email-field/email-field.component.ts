import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BaseFieldComponent } from '../base-field.component';

@Component({
  selector: 'app-email-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './email-field.component.html',
  host: { style: 'display: contents' },
  styles: [
    `:host {
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
    }`,
  ],
})
export class EmailFieldComponent extends BaseFieldComponent<string> {}
