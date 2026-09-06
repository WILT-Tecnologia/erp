import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { FinancialService } from '../financial.service';
import { BankAccount } from '../transaction.model';

@Component({
  selector: 'app-bank-accounts-page',
  standalone: true,
  imports: [CurrencyPipe, MatCardModule],
  templateUrl: './bank-accounts-page.component.html',
})
export class BankAccountsPageComponent implements OnInit {
  private readonly financialService = inject(FinancialService);

  readonly accounts = signal<BankAccount[]>([]);

  ngOnInit(): void {
    this.financialService.listAccounts().subscribe((accounts) => this.accounts.set(accounts));
  }
}
