import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, effect, inject, input, model, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';

export const DEFAULT_WIDTH = '70vw';
const FULLSCREEN_WIDTH = '95vw';
const FULLSCREEN_HEIGHT = '95vh';
const MOBILE_BREAKPOINT = '(max-width: 767.98px)';
const MOBILE_WIDTH = '90vw';
const MOBILE_FULLSCREEN_WIDTH = '99vw';

@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'app-modal',
  styleUrl: './modal.css',
  templateUrl: './modal.html',
})
export class Modal {
  private readonly dialogRef = inject(MatDialogRef, { optional: true });
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly modalTitle = input<string>('');
  readonly showCloseButton = input(true);
  readonly showFullscreenButton = input(true);
  readonly width = input(DEFAULT_WIDTH);
  readonly fullscreen = model(false);

  readonly closed = output<void>();

  private readonly isMobile = toSignal(
    this.breakpointObserver.observe(MOBILE_BREAKPOINT).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  constructor() {
    let isInitialSize = true;

    effect(() => {
      const isFullscreen = this.fullscreen();
      const mobile = this.isMobile();
      const width = mobile
        ? isFullscreen
          ? MOBILE_FULLSCREEN_WIDTH
          : MOBILE_WIDTH
        : isFullscreen
          ? FULLSCREEN_WIDTH
          : this.width();

      this.dialogRef?.updateSize(width, isFullscreen ? FULLSCREEN_HEIGHT : '');
      this.dialogRef?.[mobile ? 'addPanelClass' : 'removePanelClass']('app-modal-mobile');
      this.dialogRef?.[isFullscreen ? 'addPanelClass' : 'removePanelClass']('app-modal-fullscreen');

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
