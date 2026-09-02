import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Contact, ContactStage, STAGES } from '../contact.model';
import { LeadCardComponent } from './lead-card.component';

type ColumnMap = Record<ContactStage, Contact[]>;

function emptyColumns(): ColumnMap {
  return STAGES.reduce((acc, stage) => {
    acc[stage.id] = [];
    return acc;
  }, {} as ColumnMap);
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [DragDropModule, MatButtonModule, MatIconModule, LeadCardComponent],
  templateUrl: './kanban-board.component.html',
})
export class KanbanBoardComponent {
  readonly contacts = input<Contact[]>([]);
  readonly cardClick = output<Contact>();
  readonly stageChange = output<{ contact: Contact; stage: ContactStage }>();
  readonly addNew = output<void>();

  readonly stages = STAGES;
  readonly columns = signal<ColumnMap>(emptyColumns());

  readonly listIds = computed(() => this.stages.map((stage) => this.listId(stage.id)));

  constructor() {
    effect(() => {
      const grouped = emptyColumns();
      for (const contact of this.contacts()) {
        grouped[contact.status]?.push(contact);
      }
      this.columns.set(grouped);
    });
  }

  listId(stage: ContactStage): string {
    return `stage-${stage}`;
  }

  count(stage: ContactStage): number {
    return this.columns()[stage]?.length ?? 0;
  }

  drop(event: CdkDragDrop<Contact[]>, stage: ContactStage): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }

    const contact = event.previousContainer.data[event.previousIndex];
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    // Reflete localmente a mudança de estágio; a persistência é feita pelo componente pai.
    contact.status = stage;
    this.columns.update((cols) => ({ ...cols }));
    this.stageChange.emit({ contact, stage });
  }

  onCardClick(contact: Contact): void {
    this.cardClick.emit(contact);
  }
}
