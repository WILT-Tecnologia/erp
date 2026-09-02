import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { OrganizationContextService } from '../../core/organization/organization-context.service';

export interface Breadcrumb {
  label: string;
  link: string[] | null;
}

/**
 * Builds the breadcrumb trail from each activated route segment's static
 * `title`, walking the router state tree on every navigation. When a
 * segment carries the `:organizationId` param, the crumb label is the
 * resolved organization name instead of the route title.
 */
@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly organizationContext = inject(OrganizationContextService);

  readonly breadcrumbs = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.build()),
      startWith([] as Breadcrumb[]),
    ),
    { initialValue: [] as Breadcrumb[] },
  );

  private build(): Breadcrumb[] {
    const trail: Breadcrumb[] = [];
    let route: ActivatedRoute | null = this.router.routerState.root;
    let path = '';

    while (route) {
      const segment = route.snapshot?.url.map((s) => s.path).join('/');
      if (segment) path += `/${segment}`;

      const organizationId = route.snapshot?.paramMap.get('organizationId');
      if (organizationId) {
        trail.push({
          label: this.organizationContext.organization()?.name ?? `Organização ${organizationId}`,
          link: [path],
        });
      } else {
        const label = route.snapshot?.title;
        if (label) trail.push({ label, link: [path] });
      }

      route = route.firstChild;
    }

    return trail;
  }
}
