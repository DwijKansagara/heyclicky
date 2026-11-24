import { ReusableSkill } from '@heyclicky/shared';

class SkillManager {
  private skills: ReusableSkill[] = [
    {
      id: 'skill_concise_coder',
      name: 'Concise Code Reviewer',
      description: 'Reviews code on screen with focus on performance, edge cases, and zero fluff.',
      systemInstructions: 'Be ultra-concise. Identify the core bug or optimization, show the exact diff, and explain why.',
      enabled: true,
    },
    {
      id: 'skill_friendly_tutor',
      name: 'Creative App Tutor',
      description: 'Explains complex UI controls in Blender, Premiere Pro, or DaVinci Resolve like a friendly mentor.',
      systemInstructions: 'Use clear analogies. Always point to the exact menu or button, and explain what the hotkey is.',
      enabled: true,
    },
  ];

  public getSkills(): ReusableSkill[] {
    return [...this.skills];
  }

  public toggleSkill(id: string, enabled: boolean) {
    const s = this.skills.find((item) => item.id === id);
    if (s) {
      s.enabled = enabled;
    }
  }

  public addSkill(skill: Omit<ReusableSkill, 'id'>) {
    this.skills.push({
      ...skill,
      id: `skill_${Date.now()}`,
    });
  }

  public deleteSkill(id: string) {
    this.skills = this.skills.filter((s) => s.id !== id);
  }
}

export const skillManager = new SkillManager();
