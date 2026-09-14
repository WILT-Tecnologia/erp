import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BaseFieldComponent } from '../base-field.component';

@Component({
  selector: 'app-description-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, TextFieldModule],
  templateUrl: './description-field.component.html',
  host: { style: 'display: contents' },
})
export class DescriptionFieldComponent extends BaseFieldComponent<string> {
  readonly rows = input(3);
  readonly maxLength = input<number>();
  readonly autosize = input(false);
}
