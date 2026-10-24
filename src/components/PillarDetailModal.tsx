import React from "react";
import { Pillar } from "../utils/pillarData.ts";
import { playTechClick } from "../utils/audioFeedback.ts";

interface PillarDetailModalProps {
  pillar: Pillar | null;
  onClose: () => void;
  onInitiateInquiry: (pillarTitle: string) => void;
}

export const PillarDetailModal: React.FC<PillarDetailModalProps> = ({
  pillar,
  onClose,
  onInitiateInquiry,
}) => {
  if (!pillar) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pillar-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-2xl bg-[#12161e] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-[#ede9e3]">
        <button
          type="button"
          onClick={() => {
            playTechClick(500);
            onClose();
          }}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-base transition-colors"
          aria-label="Tutup Dialog Detail Dimensi Rekayasa"
        >
          <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span
            className="px-2.5 py-1 rounded-md text-xs font-mono font-bold"
            style={{ backgroundColor: `${pillar.color}20`, color: pillar.color }}
          >
            DIMENSI {pillar.num}
          </span>
          <span className="text-xs font-mono tracking-widest text-[#9c9689] uppercase">
            {pillar.badge}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#d8d2c4]">
            {pillar.hookTag}
          </span>
        </div>

        <h3 id="pillar-modal-title" className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
          {pillar.title}
        </h3>
        <p className="text-xs font-mono text-[#a39c8f] mb-6">
          {pillar.subtitle}
        </p>

        <div className="space-y-4 text-sm text-[#d4cec3]">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="block text-[11px] font-mono text-[#0ae3b0] uppercase mb-1">
              Deskripsi &amp; Orientasi Layanan
            </span>
            <p className="leading-relaxed text-xs sm:text-sm">{pillar.lead}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#171c26] border border-white/10">
            <span className="block text-[11px] font-mono text-[#9fcaff] uppercase mb-1">
              Daya Jangkau Eksekusi &amp; Solusi:
            </span>
            <p className="leading-relaxed text-xs text-[#cfc8bc]">{pillar.scope}</p>
          </div>

          <div>
            <h5 className="font-mono text-xs uppercase text-white tracking-wider mb-2">
              Kapabilitas Teknis &amp; Spesifikasi:
            </h5>
            <ul className="space-y-2 text-xs text-[#b8b1a4]">
              {pillar.details.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <svg className="w-3 h-3 fill-current text-[#0ae3b0] mt-0.5 flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs uppercase text-white tracking-wider mb-2">
              Fokus &amp; Keahlian Terkait:
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {pillar.highlights.map((t, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-mono text-white"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono text-[#9c9689]">
            Metrik Tolok Ukur: <strong className="text-white">{pillar.stats.value}</strong> ({pillar.stats.label})
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-white/15 text-xs font-mono text-white hover:bg-white/10 transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                playTechClick(880);
                const title = pillar.title;
                onClose();
                onInitiateInquiry(title);
              }}
              className="px-5 py-2 rounded-full bg-[#0ae3b0] text-black text-xs font-mono font-bold uppercase hover:bg-white transition-colors shadow-md"
            >
              Ajukan Kolaborasi →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
