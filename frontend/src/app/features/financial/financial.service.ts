import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';

import { BankAccount, Transaction, TransactionFormValue } from './transaction.model';

// NOTE: this domain has no real backend endpoint yet. Data is kept in-memory
// and mutated directly so the service can be swapped for real HttpClient
// calls later without touching consumers.
const mockAccounts: BankAccount[] = [
  { id: 'acc-1', name: 'Conta Principal', bank: 'Banco do Brasil', balance: 48320.5, type: 'Corrente' },
  { id: 'acc-2', name: 'Conta Operacional', bank: 'Bradesco', balance: 12450, type: 'Corrente' },
  { id: 'acc-3', name: 'Caixa', bank: '', balance: 3200, type: 'Caixa' },
  { id: 'acc-4', name: 'Poupança Missões', bank: 'Caixa Econômica', balance: 24800, type: 'Poupança' },
];

let mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    description: 'Dízimo culto domingo',
    category: 'Dízimos',
    type: 'receita',
    amount: 12450,
    account: 'Conta Principal',
    method: 'PIX',
    status: 'pago',
    date: '2026-08-23',
  },
  {
    id: 'tx-2',
    description: 'Oferta especial - missões',
    category: 'Ofertas',
    type: 'receita',
    amount: 3200,
    account: 'Poupança Missões',
    method: 'PIX',
    status: 'pago',
    date: '2026-08-22',
  },
  {
    id: 'tx-3',
    description: 'Conta de água',
    category: 'Utilidades',
    type: 'despesa',
    amount: 320,
    account: 'Conta Operacional',
    method: 'Boleto',
    status: 'atrasado',
    date: '2026-08-18',
  },
  {
    id: 'tx-4',
    description: 'Material Escola Dominical',
    category: 'Materiais',
    type: 'despesa',
    amount: 450,
    account: 'Conta Operacional',
    method: 'Cartão de Débito',
    status: 'pendente',
    date: '2026-08-21',
  },
  {
    id: 'tx-5',
    description: 'Conferência de Jovens - inscrições',
    category: 'Eventos',
    type: 'receita',
    amount: 5850,
    account: 'Conta Principal',
    method: 'PIX',
    status: 'pago',
    date: '2026-08-20',
  },
  {
    id: 'tx-6',
    description: 'Energia elétrica',
    category: 'Infraestrutura',
    type: 'despesa',
    amount: 890,
    account: 'Conta Operacional',
    method: 'Débito automático',
    status: 'pago',
    date: '2026-08-13',
  },
  {
    id: 'tx-7',
    description: 'Dízimo culto quarta-feira',
    category: 'Dízimos',
    type: 'receita',
    amount: 4780,
    account: 'Conta Principal',
    method: 'Dinheiro',
    status: 'pago',
    date: '2026-08-12',
  },
  {
    id: 'tx-8',
    description: 'Reforma do salão social',
    category: 'Infraestrutura',
    type: 'despesa',
    amount: 4800,
    account: 'Conta Principal',
    method: 'Transferência',
    status: 'pendente',
    date: '2026-08-08',
  },
];

@Injectable({ providedIn: 'root' })
export class FinancialService {
  listTransactions(): Observable<Transaction[]> {
    return of([...mockTransactions]).pipe(delay(300));
  }

  listAccounts(): Observable<BankAccount[]> {
    return of([...mockAccounts]).pipe(delay(300));
  }

  /** Contas a pagar — transações do tipo despesa. */
  listPayable(): Observable<Transaction[]> {
    return this.listTransactions().pipe(map((list) => list.filter((t) => t.type === 'despesa')));
  }

  /** Contas a receber — transações do tipo receita. */
  listReceivable(): Observable<Transaction[]> {
    return this.listTransactions().pipe(map((list) => list.filter((t) => t.type === 'receita')));
  }

  create(payload: TransactionFormValue): Observable<Transaction> {
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      ...payload,
    };
    mockTransactions = [transaction, ...mockTransactions];
    return of(transaction).pipe(delay(300));
  }

  update(id: string, payload: TransactionFormValue): Observable<Transaction> {
    let updated: Transaction | undefined;
    mockTransactions = mockTransactions.map((transaction) => {
      if (transaction.id !== id) return transaction;
      updated = { ...transaction, ...payload };
      return updated;
    });
    return of(updated as Transaction).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    mockTransactions = mockTransactions.filter((transaction) => transaction.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
