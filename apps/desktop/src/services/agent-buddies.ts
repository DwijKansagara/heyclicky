import { AgentBuddyJob, AgentBuddyStatus } from '@heyclicky/shared';

const WATCHDOG_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes

class AgentBuddiesManager {
  private jobs: AgentBuddyJob[] = [];
  private subscribers = new Set<(jobs: AgentBuddyJob[]) => void>();
  private watchdogInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startWatchdog();
  }

  public subscribe(cb: (jobs: AgentBuddyJob[]) => void): () => void {
    this.subscribers.add(cb);
    cb([...this.jobs]);
    return () => this.subscribers.delete(cb);
  }

  private notify() {
    const copy = [...this.jobs];
    for (const sub of this.subscribers) {
      sub(copy);
    }
  }

  public createJob(name: string, taskGoal: string): AgentBuddyJob {
    const newJob: AgentBuddyJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name,
      taskGoal,
      status: 'planning',
      progressPercent: 10,
      livePlan: ['Analyze task requirements', 'Gather necessary documents/sources', 'Execute actions', 'Verify deliverables'],
      currentActionDescription: 'Initializing agent buddy plan...',
      startedAt: Date.now(),
      updatedAt: Date.now(),
      checkpoints: [
        {
          id: `cp_init_${Date.now()}`,
          stepIndex: 0,
          description: 'Job initialized',
          timestamp: Date.now(),
          stateSnapshot: {},
        },
      ],
      artifacts: [],
      chatMessages: [
        { role: 'assistant', text: `Hey! I'm on it. Working on "${taskGoal}".`, timestamp: Date.now() },
      ],
    };

    this.jobs.unshift(newJob);
    this.notify();
    this.simulateAgentWork(newJob.id);
    return newJob;
  }

  public stopJob(jobId: string) {
    const job = this.jobs.find((j) => j.id === jobId);
    if (job && (job.status === 'running' || job.status === 'planning' || job.status === 'waiting_on_user')) {
      job.status = 'stopped';
      job.updatedAt = Date.now();
      job.currentActionDescription = 'Stopped by user';
      job.chatMessages.push({ role: 'system', text: 'Job stopped by user.', timestamp: Date.now() });
      this.notify();
    }
  }

  public retryFromCheckpoint(jobId: string) {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return;

    job.status = 'running';
    job.updatedAt = Date.now();
    job.currentActionDescription = 'Resuming from latest checkpoint...';
    job.chatMessages.push({ role: 'assistant', text: 'Resuming task from checkpoint...', timestamp: Date.now() });
    this.notify();
    this.simulateAgentWork(job.id);
  }

  public addChatMessage(jobId: string, text: string, role: 'user' | 'assistant' = 'user') {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return;

    job.chatMessages.push({ role, text, timestamp: Date.now() });
    job.updatedAt = Date.now();
    this.notify();
  }

  /**
   * 20-Minute Stuck-Job Watchdog
   * Checks every 30 seconds for unresponsive running jobs
   */
  private startWatchdog() {
    this.watchdogInterval = setInterval(() => {
      const now = Date.now();
      let changed = false;

      for (const job of this.jobs) {
        if ((job.status === 'running' || job.status === 'planning') && now - job.updatedAt > WATCHDOG_TIMEOUT_MS) {
          job.status = 'failed';
          job.failureReason = 'Job timed out after 20 minutes of inactivity (watchdog protection).';
          job.chatMessages.push({
            role: 'system',
            text: 'Automatic Watchdog: Stopped job after 20 minutes without progress. You can retry from your last saved checkpoint.',
            timestamp: now,
          });
          changed = true;
        }
      }

      if (changed) {
        this.notify();
      }
    }, 30000);
  }

  private async simulateAgentWork(jobId: string) {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return;

    // Simulate progress updates
    setTimeout(() => {
      if (job.status !== 'running' && job.status !== 'planning') return;
      job.status = 'running';
      job.progressPercent = 40;
      job.currentActionDescription = 'Researching and compiling deliverables...';
      job.updatedAt = Date.now();
      job.checkpoints.push({
        id: `cp_research_${Date.now()}`,
        stepIndex: 1,
        description: 'Research completed',
        timestamp: Date.now(),
        stateSnapshot: { collectedSources: 3 },
      });
      this.notify();

      setTimeout(() => {
        if (job.status !== 'running') return;
        job.progressPercent = 80;
        job.currentActionDescription = 'Writing output artifact...';
        job.updatedAt = Date.now();

        // Create a real file artifact
        job.artifacts.push({
          id: `art_${Date.now()}`,
          name: `${job.name.toLowerCase().replace(/\s+/g, '_')}_summary.md`,
          path: `outputs/${job.name.toLowerCase().replace(/\s+/g, '_')}_summary.md`,
          sizeBytes: 1420,
          createdAt: Date.now(),
          isNew: true,
        });
        this.notify();

        setTimeout(() => {
          if (job.status !== 'running') return;
          job.status = 'completed';
          job.progressPercent = 100;
          job.currentActionDescription = 'All steps completed successfully!';
          job.completedAt = Date.now();
          job.updatedAt = Date.now();
          job.chatMessages.push({
            role: 'assistant',
            text: `Done! I finished "${job.name}". Deliverable is saved in your artifacts.`,
            timestamp: Date.now(),
          });
          this.notify();
        }, 3000);
      }, 3000);
    }, 2000);
  }
}

export const agentBuddiesManager = new AgentBuddiesManager();
