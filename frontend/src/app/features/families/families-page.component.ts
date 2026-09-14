import { Component, inject, type OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { type GridColumn } from '../../shared/components/data-grid/data-grid.types';
import { NotificationService } from '../../shared/services/notification.service';
import { type Family } from './family.model';
import { FamilyService } from './family.service';
import { FamilyFormDialogComponent } from './family-form-dialog.component';

@Component({
  selector: 'app-families-page',
  standalone: true,
  imports: [DataGridComponent, MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule],
  templateUrl: './families-page.component.html',
})
export class FamiliesPageComponent implements OnInit {
  private readonly familyService = inject(FamilyService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly families = signal<Family[]>([]);
  readonly loading = signal(false);

  readonly columns: GridColumn<Family>[] = [
    { key: 'name', label: 'Família', sortable: true },
    { key: 'leader', label: 'Responsável', sortable: true },
    { key: 'members', label: 'Membros', sortable: true },
    { key: 'church', label: 'Igreja', sortable: true },
    { key: 'address', label: 'Endereço' },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      valueFn: (row) => (row.status === 'active' ? 'Ativa' : 'Inativa'),
    },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.familyService.list().subscribe({
      next: (families) => {
        this.families.set(families);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(FamilyFormDialogComponent, { width: '560px', data: {} });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.familyService.create(value).subscribe({
        next: () => {
          this.notification.success('Família criada com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao criar família.'),
      });
    });
  }

  openEdit(family: Family): void {
    const ref = this.dialog.open(FamilyFormDialogComponent, { width: '560px', data: { family } });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.familyService.update(family.id, value).subscribe({
        next: () => {
          this.notification.success('Família atualizada com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao atualizar família.'),
      });
    });
  }

  remove(family: Family): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir família', message: `Deseja excluir ${family.name}?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.familyService.delete(family.id).subscribe({
        next: () => {
          this.notification.success('Família excluída.');
          this.load();
        },
        error: () => this.notification.error('Erro ao excluir família.'),
      });
    });
  }
}
