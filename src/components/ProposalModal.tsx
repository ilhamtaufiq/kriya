import React, { useState } from "react";
import { PILLARS_DATA } from "../utils/pillarData.ts";
import { playTechClick } from "../utils/audioFeedback.ts";

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPillar?: string;
  onSuccess: (msg: string) => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  defaultPillar = "Teknologi Informasi, IoT & Keamanan Siber",
  onSuccess,
}) => {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPillar, setSelectedPillar] = useState(defaultPillar);
  const [scopeDetails, setScopeDetails] = useState("");
  const [timeline, setTimeline] = useState("Q1-Q2 (Segera)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTechClick(720);

    if (!companyName.trim() || !contactName.trim() || !email.trim()) {
      setFormError("Mohon lengkapi seluruh field kontak perusahaan.");
      return;
    }

    if (!email.includes("@")) {
      setFormError("Format alamat surel tidak valid.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(`Proposal kolaborasi telah disiapkan untuk ${companyName}. Tim Kriya akan menghubungi dalam 1x24 jam.`);
      onClose();

      // Open mailto as well for executive correspondence
      const subject = `[Kolaborasi Strategis] ${companyName} - Dimensi ${selectedPillar}`;
      const body = `Halo Tim Manajemen Kriya Studio,\n\nNama Perusahaan: ${companyName}\nPenanggung Jawab: ${contactName}\nSurel: ${email}\nDimensi Rekayasa: ${selectedPillar}\nEstimasi Timeline: ${timeline}\n\nCatatan Ruang Lingkup:\n${scopeDetails || "Permintaan diskusi eksplorasi teknis dan kerangka sinergi proyek."}\n\nTerima kasih.`;
      window.location.href = `mailto:halo@kriya.my.id?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }, 700);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-xl bg-[#11151c] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-[#ede9e3]">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            playTechClick(500);
            onClose();
          }}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-base transition-colors"
          aria-label="Tutup Formulir Proposal"
        >
          <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#0ae3b0] inline-block"></span>
          <span className="text-[11px] font-mono tracking-widest text-[#0ae3b0] uppercase">
            KOLABORASI &amp; SINERGI STRATEGIS
          </span>
        </div>

        <h3 id="proposal-modal-title" className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
          Mulai Diskusi &amp; Rancang Masa Depan
        </h3>
        <p className="text-xs font-mono text-[#a29b8e] mb-6">
          Sinergi multidisiplin terpadu menghubungkan visi imajinatif dan eksekusi berdaya tahan tinggi.
        </p>

        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company-name" className="block text-[#a29b8e] mb-1.5 uppercase tracking-wider text-[10px]">
                Nama Perusahaan / Institusi *
              </label>
              <input
                id="company-name"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="cth. PT Rekayasa Cipta"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d26] border border-white/10 text-white placeholder-white/25 focus:border-[#0ae3b0] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact-name" className="block text-[#a29b8e] mb-1.5 uppercase tracking-wider text-[10px]">
                Nama Narahubung *
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="cth. Hendra Wijaya"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d26] border border-white/10 text-white placeholder-white/25 focus:border-[#0ae3b0] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-email" className="block text-[#a29b8e] mb-1.5 uppercase tracking-wider text-[10px]">
                Alamat Surel Korespondensi *
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="corporate@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d26] border border-white/10 text-white placeholder-white/25 focus:border-[#0ae3b0] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="pillar-select" className="block text-[#a29b8e] mb-1.5 uppercase tracking-wider text-[10px]">
                Target Dimensi Rekayasa
              </label>
              <select
                id="pillar-select"
                value={selectedPillar}
                onChange={(e) => setSelectedPillar(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d26] border border-white/10 text-white focus:border-[#0ae3b0] focus:outline-none transition-colors"
              >
                {PILLARS_DATA.map((p) => (
                  <option key={p.id} value={p.title} className="bg-[#181d26] text-white">
                    Dimensi {p.num}: {p.title}
                  </option>
                ))}
                <option value="Orkestrasi Multi-Dimensi Lintas Sektor" className="bg-[#181d26] text-white">
                  Orkestrasi Multi-Dimensi Lintas Sektor
                </option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="scope-details" className="block text-[#a29b8e] mb-1.5 uppercase tracking-wider text-[10px]">
              Ringkasan Kebutuhan Proyek &amp; Spesifikasi
            </label>
            <textarea
              id="scope-details"
              rows={3}
              value={scopeDetails}
              onChange={(e) => setScopeDetails(e.target.value)}
              placeholder="Deskripsikan secara ringkas tujuan, skala infrastruktur, atau target hasil kerja..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181d26] border border-white/10 text-white placeholder-white/25 focus:border-[#0ae3b0] focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
            <span className="text-[10px] text-[#787267]">
              Kerahasiaan terjamin di bawah klausul NDA standar.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-white/20 text-[#cfc8bc] hover:bg-white/10 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-[#0ae3b0] text-black font-bold uppercase tracking-wider hover:bg-white transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? "Memproses..." : "Kirim Pengajuan →"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
