import React from 'react';
import { Heart, MessageSquare } from 'lucide-react';

interface FeedbackItem {
  name: string;
  handle: string;
  avatarText: string;
  quote: string;
  role: string;
}

const FEEDBACK: FeedbackItem[] = [
  {
    name: "Alex Rivera",
    handle: "@arivera_dev",
    avatarText: "AR",
    role: "Full-Stack Engineer",
    quote: "having clicky on windows feels like having a senior engineer sitting next to me. the ctrl+alt push to talk is so fluid, and the pointing overlay blew my mind.",
  },
  {
    name: "Elena Rostova",
    handle: "@erostova",
    avatarText: "ER",
    role: "UX Designer",
    quote: "the 2d and 3d screen annotations are unlike anything else. watching it highlight figma buttons and rotate models directly on my screen is pure magic.",
  },
  {
    name: "Marcus Vance",
    handle: "@marcus_v",
    avatarText: "MV",
    role: "Founder & CTO",
    quote: "the fact that dwij open-sourced the entire windows build and made it free with google gemini is huge. no $100/mo subscription, just pure native speed.",
  },
  {
    name: "Priya Sharma",
    handle: "@priyacodes",
    avatarText: "PS",
    role: "AI Researcher",
    quote: "gemini 2.5 flash responds almost instantaneously. by far the cleanest desktop voice assistant experience i have ever used on windows 11.",
  },
  {
    name: "David Kim",
    handle: "@dkim_builds",
    avatarText: "DK",
    role: "Software Architect",
    quote: "drive mode with the escape kill switch is executed with immense care. persistent permissions mean zero annoying popups during long workflows.",
  },
  {
    name: "Sarah Lindqvist",
    handle: "@sarahlind",
    avatarText: "SL",
    role: "Product Lead",
    quote: "the little expressive cursor characters (^ ω ^ and poppy) give it so much heart. it actually feels alive on your desktop.",
  },
];

export const FeedbackWall: React.FC = () => {
  return (
    <section className="w-full bg-[#F5F5F5] py-20 px-4 border-t border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="font-mono text-xs text-[#888888] lowercase mb-2">community</div>
          <h2 className="font-sans font-medium text-3xl sm:text-4xl text-[#000000] lowercase tracking-tight">
            what builders are saying
          </h2>
          <p className="mt-3 text-sm text-[#666666] lowercase font-sans">
            loved by software engineers, designers, founders, and students worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEEDBACK.map((item, idx) => (
            <div 
              key={idx}
              className="bg-card rounded-lg p-5 border border-[#E0E0E0] shadow-sm flex flex-col justify-between"
            >
              <p className="font-sans text-xs text-[#333333] lowercase leading-relaxed mb-4">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center space-x-3 pt-3 border-t border-[#F0F0F0]">
                <div className="w-8 h-8 rounded-full bg-[#EAEAEA] text-[#000000] font-mono text-xs flex items-center justify-center font-medium">
                  {item.avatarText}
                </div>
                <div>
                  <div className="font-sans font-medium text-xs text-[#000000] lowercase">
                    {item.name}
                  </div>
                  <div className="font-mono text-[10px] text-[#777777] lowercase">
                    {item.handle} · {item.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
