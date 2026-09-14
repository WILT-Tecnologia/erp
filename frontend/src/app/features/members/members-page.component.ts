import { Component, inject, type OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { type GridColumn } from '../../shared/components/data-grid/data-grid.types';
import { NotificationService } from '../../shared/services/notification.service';
import { type Member } from './member.model';
import { MemberService } from './member.service';
import { MemberFormDialogComponent } from './member-form-dialog.component';

const STATUS_LABELS: Record<Member['status'], string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  visitor: 'Visitante',
};

@Component({
  selector: 'app-members-page',
  standalone: true,
  imports: [DataGridComponent, MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule],
  templateUrl: './members-page.component.html',
})
export class MembersPageComponent implements OnInit {
  private readonly memberService = inject(MemberService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly members = signal<Member[]>([]);
  readonly loading = signal(false);

  readonly columns: GridColumn<Member>[] = [
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'email', label: 'E-mail', sortable: true },
    { key: 'phone', label: 'Telefone' },
    { key: 'church', label: 'Igreja', sortable: true },
    { key: 'department', label: 'Departamento', sortable: true },
    { key: 'status', label: 'Status', sortable: true, valueFn: (row) => STATUS_LABELS[row.status] },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.memberService.list().subscribe({
      next: (members) => {
        this.members.set(members);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(MemberFormDialogComponent, { width: '560px', data: {} });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.memberService.create(value).subscribe({
        next: () => {
          this.notification.success('Membro criado com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao criar membro.'),
      });
    });
  }

  openEdit(member: Member): void {
    const ref = this.dialog.open(MemberFormDialogComponent, { width: '560px', data: { member } });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.memberService.update(member.id, value).subscribe({
        next: () => {
          this.notification.success('Membro atualizado com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao atualizar membro.'),
      });
    });
  }

  remove(member: Member): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir membro', message: `Deseja excluir ${member.name}?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.memberService.delete(member.id).subscribe({
        next: () => {
          this.notification.success('Membro excluído.');
          this.load();
        },
        error: () => this.notification.error('Erro ao excluir membro.'),
      });
    });
  }
}
