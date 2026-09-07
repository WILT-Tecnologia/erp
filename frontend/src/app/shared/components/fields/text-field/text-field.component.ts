import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BaseFieldComponent } from '../base-field.component';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './text-field.component.html',
  host: { style: 'display: contents' },
})
export class TextFieldComponent extends BaseFieldComponent<string> {
  readonly type = input<'text' | 'password'>('text');
  readonly maxLength = input<number>();
}
