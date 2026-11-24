import { GuidedWalkthrough, WalkthroughStep } from '@heyclicky/shared';
import { speakText } from './audio.js';

class WalkthroughService {
  private activeWalkthrough: GuidedWalkthrough | null = null;
  private subscribers = new Set<(walkthrough: GuidedWalkthrough | null) => void>();

  public subscribe(cb: (walkthrough: GuidedWalkthrough | null) => void): () => void {
    this.subscribers.add(cb);
    cb(this.activeWalkthrough);
    return () => this.subscribers.delete(cb);
  }

  private notify() {
    for (const sub of this.subscribers) {
      sub(this.activeWalkthrough ? { ...this.activeWalkthrough } : null);
    }
  }

  public startWalkthrough(title: string, appTarget: string, steps: WalkthroughStep[]) {
    this.activeWalkthrough = {
      id: `walkthrough_${Date.now()}`,
      title,
      appTarget,
      steps,
      currentStepIndex: 0,
      isPaused: false,
    };
    this.executeCurrentStep();
  }

  public nextStep() {
    if (!this.activeWalkthrough) return;
    if (this.activeWalkthrough.currentStepIndex < this.activeWalkthrough.steps.length - 1) {
      this.activeWalkthrough.steps[this.activeWalkthrough.currentStepIndex].status = 'completed';
      this.activeWalkthrough.currentStepIndex++;
      this.executeCurrentStep();
    } else {
      this.activeWalkthrough.steps[this.activeWalkthrough.currentStepIndex].status = 'completed';
      speakText("Awesome! You completed the walkthrough.");
      this.activeWalkthrough = null;
      this.notify();
    }
  }

  public previousStep() {
    if (!this.activeWalkthrough) return;
    if (this.activeWalkthrough.currentStepIndex > 0) {
      this.activeWalkthrough.currentStepIndex--;
      this.executeCurrentStep();
    }
  }

  public repeatStep() {
    if (!this.activeWalkthrough) return;
    this.executeCurrentStep();
  }

  public togglePause() {
    if (!this.activeWalkthrough) return;
    this.activeWalkthrough.isPaused = !this.activeWalkthrough.isPaused;
    this.notify();
  }

  public cancel() {
    this.activeWalkthrough = null;
    this.notify();
  }

  private executeCurrentStep() {
    if (!this.activeWalkthrough) return;
    const step = this.activeWalkthrough.steps[this.activeWalkthrough.currentStepIndex];
    step.status = 'active';
    this.notify();

    if (step.spokenCue) {
      speakText(`Step ${step.stepNumber}: ${step.spokenCue}`);
    }
  }

  public getActive(): GuidedWalkthrough | null {
    return this.activeWalkthrough;
  }
}

export const walkthroughService = new WalkthroughService();
