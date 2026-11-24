import React from 'react';
import { Heart, MessageSquare, Repeat2 } from 'lucide-react';

interface FeedbackCard {
  name: string;
  handle: string;
  avatarText: string;
  tweet: string;
  date: string;
  likes?: string;
}

export default function FeedbackWall() {
  const tweets: FeedbackCard[] = [
    {
      name: "Greg Brockman",
      handle: "@gdb",
      avatarText: "GB",
      tweet: "GPT Realtime 2 unlocks some real magic",
      date: "5/30/26, 10:22 PM",
      likes: "2.7k",
    },
    {
      name: "Josh Pigford",
      handle: "@Shpigford",
      avatarText: "JP",
      tweet: "dear lord baby jesus please hide this from all the ai grifters so they don't ruin it.",
      date: "4/27/26, 3:21 AM",
      likes: "1.4k",
    },
    {
      name: "joshua",
      handle: "@4xiom_",
      avatarText: "J",
      tweet: "black magic",
      date: "5/30/26, 6:12 PM",
      likes: "890",
    },
    {
      name: "William Wang",
      handle: "@iamwilliamwang",
      avatarText: "WW",
      tweet: "Cool idea, been screenshotting and throwing images into Claude, this is the 10x version haha",
      date: "4/6/26, 6:12 PM",
      likes: "512",
    },
    {
      name: "Lenny Rachitsky",
      handle: "@lennysan",
      avatarText: "LR",
      tweet: "My new favorite onboarding experience. So unique and engaging.",
      date: "4/27/26, 1:51 PM",
      likes: "3.1k",
    },
    {
      name: "Belabbas Anis",
      handle: "@0xBelabbaa",
      avatarText: "BA",
      tweet: "i will tell my kids that farza built this in a cave with a box of scraps",
      date: "5/30/26, 8:01 PM",
      likes: "940",
    },
    {
      name: "Aaron Epstein",
      handle: "@aaron_epstein",
      avatarText: "AE",
      tweet: "Wild new @heyclicky demo just dropped 👀",
      date: "6/16/26, 2:12 PM",
      likes: "1.2k",
    },
    {
      name: "Putri Karunia",
      handle: "@putrikarunian",
      avatarText: "PK",
      tweet: "literally learning davinci resolve right now 👀, this looks awesome",
      date: "4/6/26, 5:46 PM",
      likes: "620",
    },
    {
      name: "Sharif Shameem",
      handle: "@sharifshameem",
      avatarText: "SS",
      tweet: "can we actually get pakwan tomorrow",
      date: "4/25/26, 11:39 PM",
      likes: "430",
    },
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-900 select-none">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
          feedback
        </span>
        <h2 className="text-3xl font-extrabold text-white">they use it everyday</h2>
        <p className="text-xs text-slate-400 font-mono">80,000+ happy users and counting. join them</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tweets.map((t, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400">
                  {t.avatarText}
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{t.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{t.handle}</div>
                </div>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{t.tweet}</p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
              <span>{t.date}</span>
              {t.likes && (
                <div className="flex items-center gap-1 text-slate-400">
                  <Heart className="w-3 h-3 text-rose-400/80 fill-current" />
                  <span>{t.likes}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
