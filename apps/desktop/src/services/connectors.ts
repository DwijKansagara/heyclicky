import { ConnectorAccount } from '@heyclicky/shared';

class ConnectorManager {
  private accounts: ConnectorAccount[] = [
    { id: 'conn_gmail_personal', service: 'gmail', label: 'Personal', userEmail: 'user@gmail.com', status: 'ready', lastSyncedAt: Date.now() - 3600000 },
    { id: 'conn_gmail_work', service: 'gmail', label: 'Work', userEmail: 'user@company.com', status: 'ready', lastSyncedAt: Date.now() - 1800000 },
    { id: 'conn_gcal', service: 'gcalendar', label: 'Personal', userEmail: 'user@gmail.com', status: 'ready', lastSyncedAt: Date.now() - 3600000 },
    { id: 'conn_gsheets', service: 'gsheets', label: 'Work', userEmail: 'user@company.com', status: 'ready', lastSyncedAt: Date.now() - 3600000 },
    { id: 'conn_notion', service: 'notion', label: 'Personal', status: 'needs_sign_in' },
    { id: 'conn_local_files', service: 'local_files', label: 'Work', status: 'ready', lastSyncedAt: Date.now() },
  ];

  public getAccounts(): ConnectorAccount[] {
    return [...this.accounts];
  }

  public connectAccount(id: string) {
    const acc = this.accounts.find((a) => a.id === id);
    if (acc) {
      acc.status = 'connecting';
      setTimeout(() => {
        acc.status = 'ready';
        acc.lastSyncedAt = Date.now();
      }, 1500);
    }
  }

  public disconnectAccount(id: string) {
    const acc = this.accounts.find((a) => a.id === id);
    if (acc) {
      acc.status = 'needs_sign_in';
    }
  }
}

export const connectorManager = new ConnectorManager();
