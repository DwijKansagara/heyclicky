import React from 'react';
import { Mic, Navigation, Edit3, Cpu, Bot, FileText, CheckCircle2 } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  badge?: string;
  bullets: string[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, tag, title, description, badge, bullets }) => (
  <div className="bg-card rounded-lg p-6 border border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-full bg-[#F5F5F5] border border-[#E0E0E0] flex items-center justify-center text-[#000000]">
          {icon}
        </div>
        <div className="flex items-center space-x-2">
          {badge && (
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
              {badge}
            </span>
          )}
          <span className="font-mono text-[11px] text-[#888888]">{tag}</span>
        </div>
      </div>
      <h3 className="font-sans font-medium text-lg text-[#000000] lowercase mb-2">
        {title}
      </h3>
      <p className="font-sans text-sm text-[#555555] lowercase leading-relaxed mb-4">
        {description}
      </p>
    </div>
    <ul className="space-y-1.5 pt-4 border-t border-[#F0F0F0] font-sans text-xs text-[#444444] lowercase">
      {bullets.map((b, i) => (
        <li key={i} className="flex items-start">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#221898] mr-2 mt-0.5 shrink-0" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="w-full bg-[#F5F5F5] py-20 px-4 border-t border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="font-mono text-xs text-[#888888] lowercase mb-2">capabilities</div>
          <h2 className="font-sans font-medium text-3xl sm:text-4xl text-[#000000] lowercase tracking-tight">
            everything clicky can do for you
          </h2>
          <p className="mt-3 text-sm text-[#666666] lowercase font-sans">
            engineered natively for windows 10/11 with zero paywalls. full pro & max features unlocked.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Mic className="w-5 h-5 text-black" />}
            tag="01"
            title="talks & listens"
            badge="ctrl+alt"
            description="press ctrl+alt to talk naturally. heyclicky sees your active screen and answers instantly using gemini 2.5 flash."
            bullets={[
              "low-level wh_keyboard_ll push-to-talk hook",
              "conversational back-and-forth interruptions",
              "100% free speech synthesis & web speech api",
            ]}
          />

          <FeatureCard
            icon={<Navigation className="w-5 h-5 text-black" />}
            tag="02"
            title="points & guides"
            badge="multi-display"
            description="guides your eyes with smooth bezier curved pointer flights directly to any button, dropdown, or menu."
            bullets={[
              "per-monitor dpi & coordinate translation",
              "spring-damped cursor buddy animations",
              "interactive step-by-step walkthroughs",
            ]}
          />

          <FeatureCard
            icon={<Edit3 className="w-5 h-5 text-black" />}
            tag="03"
            title="draws 2d & 3d"
            badge="three.js"
            description="annotates your screen in real time with circles, arrows, callouts, and interactive 3d rotating models."
            bullets={[
              "instant transparent overlay canvas",
              "three.js interactive biological & physical models",
              "clean auto-fade animations when done",
            ]}
          />

          <FeatureCard
            icon={<Cpu className="w-5 h-5 text-black" />}
            tag="04"
            title="heyclicky drive"
            badge="autonomous"
            description="hands-free pc control. moves your cursor, clicks, and types to complete repetitive tasks autonomously."
            bullets={[
              "one-time persistent permission (always allow)",
              "instant hardware kill-switch (mouse move or esc)",
              "safe action queuing & natural timing",
            ]}
          />

          <FeatureCard
            icon={<Bot className="w-5 h-5 text-black" />}
            tag="05"
            title="parallel agent buddies"
            badge="gemini pro"
            description="spawns background agent workers for deep research, bulk data extraction, and multi-file code tasks."
            bullets={[
              "deep reasoning via gemini 2.5 pro",
              "strict 20-minute safety watchdog timer",
              "independent sub-island progress indicators",
            ]}
          />

          <FeatureCard
            icon={<FileText className="w-5 h-5 text-black" />}
            tag="06"
            title="unlimited dictation"
            badge="zero caps"
            description="talk freely into any text field, word doc, or ide. automatically fixes punctuation, casing, and grammar."
            bullets={[
              "terminal newline injection protection",
              "custom user vocabulary dictionary",
              "supports 117 spoken languages natively",
            ]}
          />
        </div>
      </div>
    </section>
  );
};
