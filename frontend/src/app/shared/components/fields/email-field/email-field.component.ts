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
})
export class EmailFieldComponent extends BaseFieldComponent<string> {}
