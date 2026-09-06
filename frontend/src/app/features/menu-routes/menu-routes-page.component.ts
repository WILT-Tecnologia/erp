import { Component, computed, inject, type OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataGridComponent } from '../../shared/components/data-grid/data-grid.component';
import { type GridColumn } from '../../shared/components/data-grid/data-grid.types';
import { NotificationService } from '../../shared/services/notification.service';
import { type MenuRoute } from './menu-route.model';
import { MenuRouteService } from './menu-route.service';
import { MenuRouteFormDialogComponent } from './menu-route-form-dialog.component';

@Component({
  selector: 'app-menu-routes-page',
  standalone: true,
  imports: [DataGridComponent, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './menu-routes-page.component.html',
})
export class MenuRoutesPageComponent implements OnInit {
  private readonly menuRouteService = inject(MenuRouteService);
  private readonly dialog = inject(MatDialog);
  private readonly notification = inject(NotificationService);

  readonly menuRoutes = signal<MenuRoute[]>([]);
  readonly loading = signal(false);

  private readonly titleById = computed(() => {
    const map = new Map<string, string>();
    for (const route of this.menuRoutes()) {
      map.set(route.id, route.title);
    }
    return map;
  });

  readonly columns: GridColumn<MenuRoute>[] = [
    { key: 'title', label: 'Título', sortable: true },
    { key: 'slug', label: 'Rota', sortable: true, valueFn: (row) => row.slug ?? '—' },
    { key: 'category', label: 'Categoria', sortable: true },
    { key: 'icon', label: 'Ícone', valueFn: (row) => row.icon ?? '—' },
    {
      key: 'parent',
      label: 'Item pai',
      valueFn: (row) => (row.parent_id ? (this.titleById().get(row.parent_id) ?? '—') : '—'),
    },
    { key: 'sort_order', label: 'Ordem', sortable: true },
    { key: 'is_active', label: 'Ativo', valueFn: (row) => (row.is_active ? 'Sim' : 'Não') },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.menuRouteService.list().subscribe({
      next: (menuRoutes) => {
        this.menuRoutes.set(menuRoutes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void {
    const ref = this.dialog.open(MenuRouteFormDialogComponent, {
      width: '480px',
      data: { menuRoutes: this.menuRoutes() },
    });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.menuRouteService.create(value).subscribe({
        next: () => {
          this.notification.success('Item de menu criado com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao criar item de menu.'),
      });
    });
  }

  openEdit(menuRoute: MenuRoute): void {
    const ref = this.dialog.open(MenuRouteFormDialogComponent, {
      width: '480px',
      data: { menuRoute, menuRoutes: this.menuRoutes() },
    });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.menuRouteService.update(menuRoute.id, value).subscribe({
        next: () => {
          this.notification.success('Item de menu atualizado com sucesso.');
          this.load();
        },
        error: () => this.notification.error('Erro ao atualizar item de menu.'),
      });
    });
  }

  remove(menuRoute: MenuRoute): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Excluir item de menu', message: `Deseja excluir "${menuRoute.title}"?` },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.menuRouteService.delete(menuRoute.id).subscribe({
        next: () => {
          this.notification.success('Item de menu excluído.');
          this.load();
        },
        error: () => this.notification.error('Erro ao excluir item de menu.'),
      });
    });
  }
}
