import { RoutineWorkflow } from '@heyclicky/shared';

class RoutineManager {
  private routines: RoutineWorkflow[] = [
    {
      id: 'routine_morning_brief',
      title: 'Morning Inbox & Calendar Brief',
      cronOrSchedule: 'Every weekday at 8:30 AM',
      description: 'Reviews unread high-priority emails across personal and work Gmail and summarizes upcoming meetings.',
      enabled: true,
      lastRunAt: Date.now() - 86400000,
      nextRunAt: Date.now() + 43200000,
      notifyInChat: true,
    },
    {
      id: 'routine_daily_standup',
      title: 'Daily Standup Note Generator',
      cronOrSchedule: 'Every day at 5:00 PM',
      description: 'Summarizes git commits and files modified on your PC today into clean bullets.',
      enabled: true,
      lastRunAt: Date.now() - 86400000,
      notifyInChat: true,
    },
  ];

  public getRoutines(): RoutineWorkflow[] {
    return [...this.routines];
  }

  public toggleRoutine(id: string, enabled: boolean) {
    const r = this.routines.find((item) => item.id === id);
    if (r) {
      r.enabled = enabled;
    }
  }

  public addRoutine(routine: Omit<RoutineWorkflow, 'id'>) {
    this.routines.push({
      ...routine,
      id: `routine_${Date.now()}`,
    });
  }

  public runNow(id: string): string {
    const r = this.routines.find((item) => item.id === id);
    if (!r) return 'Routine not found';
    r.lastRunAt = Date.now();
    return `Started "${r.title}". Results will appear in your chat.`;
  }
}

export const routineManager = new RoutineManager();
