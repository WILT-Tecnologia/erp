import { Component, effect, inject, input, model, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

const DEFAULT_WIDTH = '70vw';
const FULLSCREEN_WIDTH = '95vw';
const FULLSCREEN_HEIGHT = '95vh';

@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'app-modal',
  styleUrl: './modal.css',
  templateUrl: './modal.html',
})
export class Modal {
  private readonly dialogRef = inject(MatDialogRef, { optional: true });

  readonly modalTitle = input<string>('');
  readonly showCloseButton = input(true);
  readonly showFullscreenButton = input(true);
  readonly fullscreen = model(false);

  readonly closed = output<void>();

  constructor() {
    let isInitialSize = true;

    effect(() => {
      const isFullscreen = this.fullscreen();
      this.dialogRef?.updateSize(isFullscreen ? FULLSCREEN_WIDTH : DEFAULT_WIDTH, isFullscreen ? FULLSCREEN_HEIGHT : '');
      if (isFullscreen) {
        this.dialogRef?.addPanelClass('app-modal-fullscreen');
      } else {
        this.dialogRef?.removePanelClass('app-modal-fullscreen');
      }

      // Só anima a partir da primeira alternância manual: a primeira execução
      // define o tamanho inicial do diálogo e não deve ser animada.
      if (!isInitialSize) {
        this.dialogRef?.addPanelClass('app-modal-animated');
      }
      isInitialSize = false;
    });
  }

  toggleFullscreen(): void {
    this.fullscreen.update((value) => !value);
  }
}
