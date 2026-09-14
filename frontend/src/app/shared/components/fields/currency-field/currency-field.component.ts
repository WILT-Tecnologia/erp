import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';

import { BaseFieldComponent } from '../base-field.component';

@Component({
  selector: 'app-currency-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgxMaskDirective],
  templateUrl: './currency-field.component.html',
  host: { style: 'display: contents' },
})
export class CurrencyFieldComponent extends BaseFieldComponent<string> {}
