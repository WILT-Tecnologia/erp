import { Component, input, signal } from '@angular/core';
import { type ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { BaseFieldComponent } from '../base-field.component';

export function maxFileSizeValidator(maxSizeMb: number): ValidatorFn {
  return (control) => {
    const files = (control.value ?? []) as File[];
    const tooBig = files.some((file) => file.size > maxSizeMb * 1024 * 1024);
    return tooBig ? { maxFileSize: { maxSizeMb } } : null;
  };
}

export function acceptedTypesValidator(acceptedTypes: string[]): ValidatorFn {
  return (control) => {
    const files = (control.value ?? []) as File[];
    const invalid = files.some(
      (file) => !acceptedTypes.some((type) => file.type === type || file.name.toLowerCase().endsWith(type.toLowerCase())),
    );
    return invalid ? { acceptedTypes: { acceptedTypes } } : null;
  };
}

/**
 * Material has no native file-upload control, so this field doesn't route
 * through `innerControl` like the others - there's no MatFormFieldControl to
 * bind it to. `writeValue`/`setDisabledState` are overridden to manage local
 * signals directly instead.
 */
@Component({
  selector: 'app-upload-field',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './upload-field.component.html',
  host: { style: 'display: contents' },
})
export class UploadFieldComponent extends BaseFieldComponent<File[]> {
  readonly accept = input<string>();
  readonly multiple = input(false);
  readonly maxFiles = input<number>();

  readonly files = signal<File[]>([]);
  readonly isDragging = signal(false);
  readonly uploadDisabled = signal(false);

  override writeValue(value: File[] | null): void {
    this.files.set(value ?? []);
  }

  override setDisabledState(isDisabled: boolean): void {
    this.uploadDisabled.set(isDisabled);
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addFiles(input.files);
    input.value = '';
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    this.addFiles(event.dataTransfer?.files ?? null);
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  handleDragLeave(): void {
    this.isDragging.set(false);
  }

  removeFile(index: number): void {
    const next = this.files().filter((_, i) => i !== index);
    this.files.set(next);
    this.onChange(next);
    this.onTouched();
  }

  private addFiles(fileList: FileList | null): void {
    if (!fileList || fileList.length === 0) {
      return;
    }
    const incoming = Array.from(fileList);
    const merged = this.multiple() ? [...this.files(), ...incoming] : incoming.slice(0, 1);
    const maxFiles = this.maxFiles();
    const next = maxFiles ? merged.slice(0, maxFiles) : merged;
    this.files.set(next);
    this.onChange(next);
    this.onTouched();
  }
}
