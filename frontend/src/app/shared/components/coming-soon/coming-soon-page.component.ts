import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coming-soon-page',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="flex flex-col items-center justify-center gap-3 py-24 text-center text-on-surface/60">
      <mat-icon class="!text-4xl !w-10 !h-10">construction</mat-icon>
      <h1 class="text-xl font-medium text-on-surface">{{ title }}</h1>
      <p class="text-sm max-w-sm">Este módulo ainda está em desenvolvimento e será disponibilizado em breve.</p>
    </div>
  `,
})
export class ComingSoonPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly title = this.route.snapshot.title ?? 'Em breve';
}
