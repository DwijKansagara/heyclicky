import React from 'react';
import { Shield, EyeOff, Lock, AlertOctagon } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section id="trust" className="w-full bg-[#F5F5F5] py-20 px-4 border-t border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="font-mono text-xs text-[#888888] lowercase mb-2">privacy & security</div>
          <h2 className="font-sans font-medium text-3xl sm:text-4xl text-[#000000] lowercase tracking-tight">
            engineered with strict privacy boundaries
          </h2>
          <p className="mt-3 text-sm text-[#666666] lowercase font-sans">
            your computer belongs to you. zero continuous screen recordings, zero hidden tracking, 100% open-source code you can audit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Boundary 1 */}
          <div className="bg-card rounded-lg p-6 border border-[#E0E0E0] shadow-sm flex space-x-4">
            <div className="w-10 h-10 rounded-full bg-[#F5F5F5] border border-[#E0E0E0] flex items-center justify-center text-[#000000] shrink-0">
              <EyeOff className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-sans font-medium text-base text-[#000000] lowercase mb-1">
                zero continuous screen recording
              </h3>
              <p className="font-sans text-xs text-[#555555] lowercase leading-relaxed">
                heyclicky never captures your screen in the background. screen snapshots are taken only at the exact instant you press push-to-talk (ctrl+alt) or issue a direct command, and are discarded immediately after processing.
              </p>
            </div>
          </div>

          {/* Boundary 2 */}
          <div className="bg-card rounded-lg p-6 border border-[#E0E0E0] shadow-sm flex space-x-4">
            <div className="w-10 h-10 rounded-full bg-[#F5F5F5] border border-[#E0E0E0] flex items-center justify-center text-[#000000] shrink-0">
              <Lock className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-sans font-medium text-base text-[#000000] lowercase mb-1">
                windows dpapi local key encryption
              </h3>
              <p className="font-sans text-xs text-[#555555] lowercase leading-relaxed">
                your google gemini api key and settings are encrypted using windows data protection api (electron.safestorage dpapi). keys are never uploaded to any third-party server or telemetry collector.
              </p>
            </div>
          </div>

          {/* Boundary 3 */}
          <div className="bg-card rounded-lg p-6 border border-[#E0E0E0] shadow-sm flex space-x-4">
            <div className="w-10 h-10 rounded-full bg-[#F5F5F5] border border-[#E0E0E0] flex items-center justify-center text-[#000000] shrink-0">
              <AlertOctagon className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-sans font-medium text-base text-[#000000] lowercase mb-1">
                instant hardware kill-switch
              </h3>
              <p className="font-sans text-xs text-[#555555] lowercase leading-relaxed">
                during heyclicky drive autonomous pc actions, touching your physical mouse, speaking, or tapping escape instantly halts all input injection in under 1 millisecond. no queued clicks ever run away.
              </p>
            </div>
          </div>

          {/* Boundary 4 */}
          <div className="bg-card rounded-lg p-6 border border-[#E0E0E0] shadow-sm flex space-x-4">
            <div className="w-10 h-10 rounded-full bg-[#F5F5F5] border border-[#E0E0E0] flex items-center justify-center text-[#000000] shrink-0">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-sans font-medium text-base text-[#000000] lowercase mb-1">
                prompt injection & terminal defenses
              </h3>
              <p className="font-sans text-xs text-[#555555] lowercase leading-relaxed">
                incoming web content and dictation text are automatically sanitized against newline injection, malicious shell commands, and untrusted hidden instruction tags before reaching your terminal or ide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
