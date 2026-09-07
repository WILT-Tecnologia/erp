import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';

import { BaseFieldComponent } from '../base-field.component';

@Component({
  selector: 'app-masked-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgxMaskDirective],
  templateUrl: './masked-field.component.html',
  host: { style: 'display: contents' },
})
export class MaskedFieldComponent extends BaseFieldComponent<string> {
  readonly mask = input.required<string>();
  readonly dropSpecialCharacters = input(true);
}
