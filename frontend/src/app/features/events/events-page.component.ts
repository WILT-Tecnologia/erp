import { DatePipe } from '@angular/common';
import { Component, computed, inject, type OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { type GridColumn } from '../../shared/components/data-grid/data-grid.types';
import { NotificationService } from '../../shared/services/notification.service';
import { type Event, type EventStatus } from './event.model';
import { EventService } from './event.service';
import { EventFormDialogComponent } from './event-form-dialog.component';

const STATUS_LABELS: Record<EventStatus, string> = {
  scheduled: 'Agendado',
  ongoing: 'Em andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [DataGridComponent, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatMenuModule],
  providers: [DatePipe],
  templateUrl: './events-page.component.html',
})
export class EventsPageComponent implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);
  private readonly datePipe = inject(DatePipe);

  readonly events = signal<Event[]>([]);
  readonly loading = signal(false);

  readonly scheduledCount = computed(
    () => this.events().filter((e) => e.status === 'scheduled' || e.status === 'ongoing').length,
  );
  readonly totalParticipants = computed(() => this.events().reduce((sum, e) => sum + e.participants, 0));
  readonly completedCount = computed(() => this.events().filter((e) => e.status === 'completed').length);

  readonly columns: GridColumn<Event>[] = [
    { key: 'title', label: 'Evento', sortable: true },
    { key: 'church', label: 'Igreja', sortable: true },
    { key: 'category', label: 'Categoria', sortable: true },
    {
      key: 'date',
      label: 'Data',
      sortable: true,
      valueFn: (row) => this.datePipe.transform(row.date, 'dd/MM/yyyy') ?? row.date,
    },
    { key: 'location', label: 'Local' },
    {
      key: 'participants',
      label: 'Inscritos',
      valueFn: (row) => `${row.participants}/${row.capacity}`,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      valueFn: (row) => STATUS_LABELS[row.status],
    },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.eventService.list().subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(EventFormDialogComponent, { width: '560px', data: {} });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.eventService.create(value).subscribe({
        next: () => {
          this.notification.success('Evento criado com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao criar evento.'),
      });
    });
  }

  openEdit(event: Event): void {
    const ref = this.dialog.open(EventFormDialogComponent, { width: '560px', data: { event } });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.eventService.update(event.id, value).subscribe({
        next: () => {
          this.notification.success('Evento atualizado com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao atualizar evento.'),
      });
    });
  }

  remove(event: Event): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir evento', message: `Deseja excluir ${event.title}?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.eventService.delete(event.id).subscribe({
        next: () => {
          this.notification.success('Evento excluído.');
          this.load();
        },
        error: () => this.notification.error('Erro ao excluir evento.'),
      });
    });
  }
}
