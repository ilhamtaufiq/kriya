import React, { useState, useEffect, useRef } from "react";
import { PILLARS_DATA, filterPillars, Pillar } from "./utils/pillarData.ts";
import { PillarDetailModal } from "./components/PillarDetailModal.tsx";
import { ProposalModal } from "./components/ProposalModal.tsx";
import { playTechClick } from "./utils/audioFeedback.ts";
import { useBentoObserver } from "./utils/useBentoObserver.ts";

function StarIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
    </svg>
  );
}

function useTypewriter(text: string, speed = 34, startDelay = 400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      let currentIndex = 0;
      intervalId = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayed(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          setDone(true);
          clearInterval(intervalId);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isSeekingRef = useRef(false);
  const targetTimeRef = useRef(0);
  const prevXRef = useRef<number | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Bento Grid Intersection Observer
  const { registerItem, isItemVisible } = useBentoObserver();

  // Dimension & Modal States
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedPillarModal, setSelectedPillarModal] = useState<Pillar | null>(null);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [proposalDefaultPillar, setProposalDefaultPillar] = useState<string>(
    "Teknologi Informasi, IoT & Keamanan Siber"
  );

  const statementText = "Kami merancang pengalaman digital, visual bernarasi, dan produk yang berjiwa.";
  const { displayed, done: typingDone } = useTypewriter(statementText, 34, 450);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPillsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Video Mouse Scrub Controller (Left <-> Right cursor scrub)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const SENSITIVITY = 0.95;

    const performSeek = () => {
      if (!video || isSeekingRef.current) return;
      if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
        isSeekingRef.current = true;
        try {
          video.currentTime = targetTimeRef.current;
        } catch {
          isSeekingRef.current = false;
        }
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
        performSeek();
      }
    };

    video.addEventListener("seeked", handleSeeked);

    const handleMouseMove = (e: MouseEvent) => {
      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      const duration = video.duration || 10;
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * duration;

      let newTarget = targetTimeRef.current + timeOffset;
      if (newTarget < 0) newTarget = 0;
      if (newTarget > duration) newTarget = duration;

      targetTimeRef.current = newTarget;
      performSeek();
    };

    const handleLoadedMetadata = () => {
      targetTimeRef.current = 0;
      video.currentTime = 0;
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const copyEmail = (e?: React.MouseEvent) => {
    e?.preventDefault();
    playTechClick(800);
    navigator.clipboard.writeText("halo@kriya.my.id").then(() => {
      setCopied(true);
      setToastMessage("Surel disalin ke clipboard: halo@kriya.my.id");
      setTimeout(() => {
        setCopied(false);
        setToastMessage("");
      }, 3200);
    });
  };

  const handleInitiateInquiry = (pillarTitle: string) => {
    playTechClick(750);
    setProposalDefaultPillar(pillarTitle);
    setProposalModalOpen(true);
  };

  const handleTabChange = (tabId: string) => {
    playTechClick(600);
    setActiveTab(tabId);
  };

  const visiblePillars = filterPillars(activeTab);

  return (
    <div className="relative min-h-screen w-full select-text text-[#ede9e3] bg-[#0b0c0e]">
      {/* Continuous Grid background texture */}
      <div className="fixed inset-0 z-0 pointer-events-none noise-grid-overlay opacity-90"></div>

      {/* 1. Top Metadata Header with accurate Coordinates */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none flex justify-between items-center px-6 sm:px-12 pt-3 text-[10px] sm:text-[11px] tracking-[0.22em] text-[#e2a96d]/75 uppercase font-mono bg-gradient-to-b from-[#0b0c0e]/95 to-transparent pb-4">
        <span>INDONESIA • 6°49&apos;54.6&quot;S 107°10&apos;17.2&quot;E</span>
        <span className="hidden md:inline">EDISI 2025.VOL-IV — DESAIN &amp; TEKNOLOGI</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0ae3b0] inline-block"></span>
          STATUS: TERBUKA UNTUK KOLABORASI
        </span>
      </div>

      {/* 2. Main Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 pt-10 pb-3 flex justify-between items-center w-full bg-[#0b0c0e]/85 backdrop-blur-md border-b border-white/5 transition-all">
        {/* Logo: Kriya. Atelier Digital */}
        <a href="#" className="flex items-center gap-3 group" onClick={() => playTechClick(900)}>
          <div className="w-9 h-9 rounded-full border border-[#0ae3b0]/40 bg-[#161719]/80 backdrop-blur-md flex items-center justify-center text-[#0ae3b0] group-hover:rotate-45 transition-transform duration-500 shadow-sm">
            <StarIcon className="w-4 h-4 text-[#0ae3b0]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-[22px] sm:text-[25px] tracking-tight text-white leading-none">
              Kriya<span className="text-[#0ae3b0]">.</span>
            </span>
            <span className="text-[9.5px] uppercase tracking-[0.22em] text-[#9c9689] font-medium mt-1">
              ATELIER DIGITAL &amp; REKAYASA
            </span>
          </div>
        </a>

        {/* Navigation with Hook Label */}
        <nav className="hidden md:flex items-center gap-2 bg-[#131518]/90 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10 text-[13.5px] text-[#cfc8bc] shadow-xl">
          <a
            href="#hero"
            onClick={() => playTechClick(600)}
            className="px-2.5 py-1 hover:text-white transition-colors"
          >
            Beranda
          </a>
          <span className="text-white/20 text-xs">•</span>
          <a
            href="#dimensi-rekayasa"
            onClick={() => playTechClick(600)}
            className="px-2.5 py-1 text-[#0ae3b0] hover:text-[#5affcc] transition-colors font-medium flex items-center gap-1.5"
          >
            <span>Dimensi Rekayasa</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#0ae3b0]/15 text-[#0ae3b0] border border-[#0ae3b0]/30 font-mono">
              4
            </span>
          </a>
          <span className="text-white/20 text-xs">•</span>
          <a
            href="#layanan"
            onClick={() => playTechClick(600)}
            className="px-2.5 py-1 hover:text-white transition-colors"
          >
            Layanan
          </a>
          <span className="text-white/20 text-xs">•</span>
          <a
            href="#studio"
            onClick={() => playTechClick(600)}
            className="px-2.5 py-1 hover:text-white transition-colors"
          >
            Studio
          </a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleInitiateInquiry("Inquiry Umum Kriya")}
            className="group relative inline-flex items-center gap-2 text-[12px] uppercase tracking-wider font-semibold px-5 py-2.5 rounded-full bg-[#f4ece1] text-[#0f1012] hover:bg-[#0ae3b0] hover:text-black transition-all duration-300 shadow-[0_4px_24px_rgba(10,227,176,0.18)]"
          >
            <span>MULAI KOLABORASI</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => {
            playTechClick(600);
            setMenuOpen(!menuOpen);
          }}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full bg-[#181a1d]/85 border border-white/10 gap-1.5 focus:outline-none z-50 text-white"
          aria-label="Buka Menu Navigasi"
        >
          <span
            className={`w-5 h-[2px] bg-[#f1eee8] transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-[8px]" : ""
            }`}
          />
          <span
            className={`w-3.5 h-[2px] bg-[#0ae3b0] self-start ml-2.5 transition-all duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-[#f1eee8] transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-[8px]" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile Overlay Menu */}
      <div
        className={`fixed inset-0 bg-[#0b0c0ee6] backdrop-blur-2xl z-40 flex flex-col justify-center px-8 sm:px-12 gap-6 transition-all duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <span className="text-[11px] font-mono tracking-widest text-[#0ae3b0] uppercase">
          Navigasi Ekosistem Kriya
        </span>
        <a
          href="#hero"
          onClick={() => setMenuOpen(false)}
          className="font-display text-[30px] font-bold text-white hover:text-[#0ae3b0] transition-colors"
        >
          Beranda
        </a>
        <a
          href="#dimensi-rekayasa"
          onClick={() => setMenuOpen(false)}
          className="font-display text-[30px] font-bold text-[#0ae3b0] hover:text-[#5affcc] transition-colors flex items-center justify-between"
        >
          <span>4 Dimensi Rekayasa</span>
          <span className="text-sm font-mono px-2 py-0.5 rounded border border-[#0ae3b0]/40">
            4 DOMAIN UTAMA
          </span>
        </a>
        <a
          href="#layanan"
          onClick={() => setMenuOpen(false)}
          className="font-display text-[30px] font-bold text-white hover:text-[#0ae3b0] transition-colors"
        >
          Layanan &amp; Lingkup
        </a>
        <a
          href="#studio"
          onClick={() => setMenuOpen(false)}
          className="font-display text-[30px] font-bold text-white hover:text-[#0ae3b0] transition-colors"
        >
          Tentang Studio
        </a>
        <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
          <button
            type="button"
            onClick={copyEmail}
            className="text-left text-base text-[#e2a96d] underline underline-offset-4 font-mono"
          >
            halo@kriya.my.id
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              handleInitiateInquiry("Inquiry Umum Mobile");
            }}
            className="mt-2 text-center py-3 bg-[#0ae3b0] text-black font-semibold rounded-full hover:bg-white transition-colors text-xs tracking-widest uppercase font-mono"
          >
            MULAI KOLABORASI →
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 sm:right-8 z-50 bg-[#191c20] text-[#f4ece1] border border-[#0ae3b0]/70 px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm flex items-center gap-2.5">
          <StarIcon className="w-3.5 h-3.5 text-[#0ae3b0] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 1: HERO SECTION (Dedicated Ambient Video Scrubber) */}
      {/* ============================================================== */}
      <section id="hero" className="relative z-10 w-full min-h-[94vh] flex items-center overflow-hidden">
        {/* Video Scrubber Ambient Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <video
            ref={videoRef}
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
            className="bg-video-scrub"
            muted
            playsInline
            preload="auto"
          />
          {/* Vertical soft gradient fade to guarantee smooth background transition */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-[#0b0c0e] pointer-events-none"></div>
          <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-[#0b0c0e]/95 via-[#0b0c0e]/80 to-transparent pointer-events-none"></div>
        </div>

        {/* Hero Text & Pill Interactive Layer */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20 pt-32 pb-24">
          <div className="max-w-3xl">
            {/* Hero intro badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#181a1d]/85 border border-white/15 backdrop-blur-md mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#0ae3b0]"></span>
              <span className="text-[12.5px] sm:text-[13.5px] font-normal tracking-wide text-[#d9d3c7]">
                Halo, selamat datang di <strong className="text-white font-semibold">Kriya Studio</strong> — Laboratorium Kreatif &amp; Rekayasa Terpadu
              </span>
            </div>

            {/* Hero typewriter statement */}
            <h1 className="text-white font-normal mb-10 text-[32px] sm:text-[42px] md:text-[50px] leading-[1.2] tracking-[-0.02em] min-h-[110px] sm:min-h-[135px] md:min-h-[160px] font-display">
              {displayed}
              {!typingDone && (
                <span className="inline-block w-[3px] h-[0.9em] bg-[#0ae3b0] align-middle ml-2 animate-blink" />
              )}
            </h1>

            {/* Interactive action pill buttons with Compelling Hooks */}
            <div
              className={`flex flex-wrap items-center gap-3 transition-all duration-700 ease-out ${
                pillsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {/* 1. Ajukan Ide Proyek ↗ */}
              <button
                type="button"
                onClick={() => handleInitiateInquiry("Inisiasi Ide Proyek Baru")}
                className="pill-card inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f4ece1] text-[#0f1012] font-semibold text-[13.5px] hover:bg-[#0ae3b0] hover:text-black transition-all cursor-pointer shadow-md"
              >
                <span>Ajukan Ide Proyek</span>
                <span className="text-xs">↗</span>
              </button>

              {/* 2. ✦ Jelajahi 4 Dimensi Rekayasa (HOOK COPY) */}
              <a
                href="#dimensi-rekayasa"
                onClick={() => playTechClick(650)}
                className="pill-card inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181a1d]/80 text-[#ede8df] border border-[#0ae3b0]/40 text-[13.5px] font-medium hover:border-[#0ae3b0] hover:text-white transition-all cursor-pointer shadow-sm"
              >
                <StarIcon className="w-3 h-3 text-[#0ae3b0]" />
                <span>Eksplorasi 4 Dimensi Rekayasa</span>
              </a>

              {/* 3. Kenali Cara Kerja */}
              <a
                href="#layanan"
                onClick={() => playTechClick(650)}
                className="pill-card inline-flex items-center px-5 py-2.5 rounded-full bg-[#181a1d]/80 text-[#ede8df] border border-white/15 text-[13.5px] font-medium hover:border-[#0ae3b0]/70 hover:text-white transition-all cursor-pointer shadow-sm"
              >
                <span>Kenali Cara Kerja</span>
              </a>

              {/* 4. Gabung Kolektif */}
              <button
                type="button"
                onClick={() => handleInitiateInquiry("Gabung Kolektif Kriya")}
                className="pill-card inline-flex items-center px-5 py-2.5 rounded-full bg-[#181a1d]/80 text-[#ede8df] border border-white/15 text-[13.5px] font-medium hover:border-white/40 hover:text-white transition-all cursor-pointer shadow-sm"
              >
                <span>Gabung Kolektif</span>
              </button>

              {/* 5. Kontak kami: halo@kriya.my.id */}
              <button
                type="button"
                onClick={copyEmail}
                className="pill-card group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-transparent text-[#e2a96d] border border-[#e2a96d]/80 text-[13.5px] font-medium hover:bg-[#e2a96d] hover:text-[#0f1012] transition-all cursor-pointer shadow-sm"
                title="Klik untuk menyalin alamat email"
              >
                <span>
                  Kontak kami: <span className="underline underline-offset-4 decoration-[#e2a96d]/60">halo@kriya.my.id</span>
                </span>
                
                <span className="flex items-center justify-center">
                  {copied ? (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-green-300 group-hover:text-black">
                      Tersalin!
                    </span>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current transition-colors"
                    >
                      <rect x="5.5" y="2.5" width="8" height="8" rx="1.5" strokeWidth="1.3" />
                      <rect x="2.5" y="5.5" width="8" height="8" rx="1.5" strokeWidth="1.3" fill="none" />
                    </svg>
                  )}
                </span>
              </button>
            </div>

            {/* Interactive cursor scrub hint */}
            <div className="mt-12 flex items-center gap-3 text-[11px] font-mono tracking-widest text-[#9c9689]/75 uppercase">
              <span className="inline-block w-8 h-[1px] bg-white/20"></span>
              <span>GERAKKAN KURSOR HORIZONTAL UNTUK MEMUTAR VISUAL NARASI</span>
            </div>

            {/* Scroll down indicator to Core Dimensions */}
            <div className="mt-8">
              <a
                href="#dimensi-rekayasa"
                onClick={() => playTechClick(500)}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#0ae3b0] hover:text-white transition-colors group"
              >
                <span className="w-6 h-6 rounded-full border border-[#0ae3b0]/40 flex items-center justify-center group-hover:translate-y-1 transition-transform">
                  ↓
                </span>
                <span className="tracking-widest uppercase">TELUSURI 4 DIMENSI REKAYASA KRIYA</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 2: METRICS & TICKER BAR */}
      {/* ============================================================== */}
      <section className="relative z-20 border-y border-white/10 bg-[#10141a]/95 backdrop-blur-xl py-6 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="border-r border-white/10 pr-4 last:border-r-0">
            <div className="text-[28px] sm:text-[34px] font-display font-bold text-white tracking-tight flex items-baseline justify-center md:justify-start gap-1">
              <span>04</span>
              <span className="text-[#0ae3b0] text-lg font-mono">Dimensi</span>
            </div>
            <div className="text-[11.5px] font-mono uppercase tracking-wider text-[#9c9689] mt-0.5">
              Spektrum Rekayasa Terpadu
            </div>
          </div>

          <div className="border-r border-white/10 pr-4 last:border-r-0">
            <div className="text-[28px] sm:text-[34px] font-display font-bold text-[#5affcc] tracking-tight flex items-baseline justify-center md:justify-start gap-1">
              <span>24+</span>
              <span className="text-white/60 text-lg font-mono">Spesialisasi</span>
            </div>
            <div className="text-[11.5px] font-mono uppercase tracking-wider text-[#9c9689] mt-0.5">
              Lintas Domain Tanpa Batas
            </div>
          </div>

          <div className="border-r border-white/10 pr-4 last:border-r-0">
            <div className="text-[28px] sm:text-[34px] font-display font-bold text-[#e2a96d] tracking-tight flex items-baseline justify-center md:justify-start gap-1">
              <span>100%</span>
              <span className="text-white/60 text-lg font-mono">Dedikasi</span>
            </div>
            <div className="text-[11.5px] font-mono uppercase tracking-wider text-[#9c9689] mt-0.5">
              Standar Mutu &amp; Presisi Tinggi
            </div>
          </div>

          <div>
            <div className="text-[28px] sm:text-[34px] font-display font-bold text-white tracking-tight flex items-baseline justify-center md:justify-start gap-1">
              <span>End-to-End</span>
            </div>
            <div className="text-[11.5px] font-mono uppercase tracking-wider text-[#9c9689] mt-0.5">
              Integrasi Eksekusi Multisektor
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 3: 4 DIMENSI CIPTA & EKSEKUSI (BENTO GRID SECTION) */}
      {/* ============================================================== */}
      <section id="dimensi-rekayasa" className="relative z-20 py-24 px-6 sm:px-12 md:px-16 max-w-7xl mx-auto">
        {/* Header of Section with Compelling Hook */}
        <div
          ref={(el) => registerItem("header", el)}
          data-bento-id="header"
          className={`flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-8 gap-6 bento-header-fade ${
            isItemVisible("header") ? "bento-visible" : ""
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0ae3b0]/10 border border-[#0ae3b0]/30 text-[#0ae3b0] text-[11px] font-mono tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0ae3b0]"></span>
              Arsitektur Kapabilitas Kriya
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-[1.15]">
              4 DIMENSI CIPTA &amp; EKSEKUSI <br className="hidden sm:inline"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ae3b0] via-[#5affcc] to-[#9fcaff]">
                DARI KODE SIBER HINGGA RANTAI PASOK
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#b0a99c] max-w-2xl leading-relaxed">
              Arsitektur solusi tanpa sekat: melebur rekayasa perangkat lunak berkecepatan tinggi, kecerdasan spasial parametrik, komoditas nusantara berstandar global, serta kesiapan armada logistik terintegrasi.
            </p>
          </div>

          {/* Interactive Tab Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 bg-[#141820]/90 p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => handleTabChange("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeTab === "ALL"
                  ? "bg-[#0ae3b0] text-black font-semibold shadow-md"
                  : "text-[#9c9689] hover:text-white"
              }`}
            >
              Semua Dimensi
            </button>
            {PILLARS_DATA.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => handleTabChange(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                  activeTab === p.id
                    ? "bg-white/15 text-white font-medium border border-white/20"
                    : "text-[#9c9689] hover:text-white"
                }`}
              >
                <span>{p.num}</span>
                <span className="hidden lg:inline">{p.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* BENTO GRID DISPLAY */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 01: Dimensi 01 - Cyber & Digital */}
          {(activeTab === "ALL" || activeTab === "01") && (
            <div
              ref={(el) => registerItem("01", el)}
              data-bento-id="01"
              className={`glass-panel group relative rounded-3xl p-7 sm:p-9 flex flex-col justify-between overflow-hidden border border-[#0ae3b0]/25 bento-fade-item bento-delay-0 ${
                isItemVisible("01") ? "bento-visible" : ""
              } ${activeTab === "ALL" ? "md:col-span-7" : "md:col-span-12"}`}
            >
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-[#0ae3b0]/10 blur-3xl pointer-events-none group-hover:bg-[#0ae3b0]/20 transition-all duration-700"></div>

              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#0ae3b0]/20 text-[#0ae3b0] border border-[#0ae3b0]/40 flex items-center justify-center font-mono font-bold text-xs">
                      01
                    </span>
                    <span className="text-[11px] font-mono tracking-widest text-[#0ae3b0] uppercase">
                      {PILLARS_DATA[0].badge}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#d8d2c4]">
                    {PILLARS_DATA[0].hookTag}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mb-2 group-hover:text-[#5affcc] transition-colors">
                  {PILLARS_DATA[0].title}
                </h3>
                <div className="text-xs font-mono text-[#9c9689] uppercase tracking-wider mb-4">
                  {PILLARS_DATA[0].subtitle}
                </div>

                <p className="text-[#c7c0b3] text-sm sm:text-base leading-relaxed mb-6">
                  {PILLARS_DATA[0].lead}
                </p>

                <div className="bg-[#12161d]/80 rounded-2xl p-4 border border-white/5 mb-6 text-xs text-[#b8b0a1] leading-relaxed">
                  <strong className="text-white block font-medium mb-1 font-mono uppercase text-[10px] tracking-wider text-[#0ae3b0]">
                    Daya Jangkau Eksekusi:
                  </strong>
                  {PILLARS_DATA[0].scope}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {PILLARS_DATA[0].highlights.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[#181d24] text-[#0ae3b0] border border-[#0ae3b0]/30 text-xs font-mono hover:bg-[#0ae3b0] hover:text-black transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-display font-bold text-white">99.98%</div>
                  <div className="text-[11px] font-mono text-[#9c9689] uppercase leading-tight">
                    Tingkat Ketersediaan &amp;<br />Keandalan Sistem
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playTechClick(600);
                      setSelectedPillarModal(PILLARS_DATA[0]);
                    }}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  >
                    Detail Cakupan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInitiateInquiry(PILLARS_DATA[0].title)}
                    className="px-4 py-2 rounded-full bg-[#0ae3b0] hover:bg-[#5affcc] text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>Konsultasi Siber</span>
                    <span>↗</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Card 02: Dimensi 02 - Spatial & Strategy */}
          {(activeTab === "ALL" || activeTab === "02") && (
            <div
              ref={(el) => registerItem("02", el)}
              data-bento-id="02"
              className={`glass-panel group relative rounded-3xl p-7 sm:p-9 flex flex-col justify-between overflow-hidden border border-[#9fcaff]/25 bento-fade-item bento-delay-1 ${
                isItemVisible("02") ? "bento-visible" : ""
              } ${activeTab === "ALL" ? "md:col-span-5" : "md:col-span-12"}`}
            >
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 rounded-full bg-[#9fcaff]/10 blur-3xl pointer-events-none group-hover:bg-[#9fcaff]/20 transition-all duration-700"></div>

              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#9fcaff]/20 text-[#9fcaff] border border-[#9fcaff]/40 flex items-center justify-center font-mono font-bold text-xs">
                      02
                    </span>
                    <span className="text-[11px] font-mono tracking-widest text-[#9fcaff] uppercase">
                      {PILLARS_DATA[1].badge}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#d8d2c4]">
                    {PILLARS_DATA[1].hookTag}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mb-2 group-hover:text-[#9fcaff] transition-colors">
                  {PILLARS_DATA[1].title}
                </h3>
                <div className="text-xs font-mono text-[#9c9689] uppercase tracking-wider mb-4">
                  {PILLARS_DATA[1].subtitle}
                </div>

                <p className="text-[#c7c0b3] text-sm leading-relaxed mb-6">
                  {PILLARS_DATA[1].lead}
                </p>

                <div className="bg-[#12161d]/80 rounded-2xl p-4 border border-white/5 mb-6 text-xs text-[#b8b0a1] leading-relaxed">
                  <strong className="text-white block font-medium mb-1 font-mono uppercase text-[10px] tracking-wider text-[#9fcaff]">
                    Daya Jangkau Eksekusi:
                  </strong>
                  {PILLARS_DATA[1].scope}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {PILLARS_DATA[1].highlights.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-[#181d24] text-[#9fcaff] border border-[#9fcaff]/30 text-xs font-mono hover:bg-[#9fcaff] hover:text-black transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-2xl font-display font-bold text-white">35+</div>
                  <div className="text-[11px] font-mono text-[#9c9689] uppercase">Studi Desain &amp; Advisory</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playTechClick(600);
                      setSelectedPillarModal(PILLARS_DATA[1]);
                    }}
                    className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  >
                    Detail
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInitiateInquiry(PILLARS_DATA[1].title)}
                    className="px-4 py-2 rounded-full bg-[#9fcaff] hover:bg-white text-black text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <span>Diskusi Spasial</span>
                    <span>↗</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Card 03: Dimensi 03 - Komoditas & Agro Cold-Chain */}
          {(activeTab === "ALL" || activeTab === "03") && (
            <div
              ref={(el) => registerItem("03", el)}
              data-bento-id="03"
              className={`glass-panel group relative rounded-3xl p-7 sm:p-9 flex flex-col justify-between overflow-hidden border border-[#e2a96d]/25 bento-fade-item bento-delay-2 ${
                isItemVisible("03") ? "bento-visible" : ""
              } ${activeTab === "ALL" ? "md:col-span-5" : "md:col-span-12"}`}
            >
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 rounded-full bg-[#e2a96d]/10 blur-3xl pointer-events-none group-hover:bg-[#e2a96d]/20 transition-all duration-700"></div>

              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#e2a96d]/20 text-[#e2a96d] border border-[#e2a96d]/40 flex items-center justify-center font-mono font-bold text-xs">
                      03
                    </span>
                    <span className="text-[11px] font-mono tracking-widest text-[#e2a96d] uppercase">
                      {PILLARS_DATA[2].badge}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#d8d2c4]">
                    {PILLARS_DATA[2].hookTag}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mb-2 group-hover:text-[#e2a96d] transition-colors">
                  {PILLARS_DATA[2].title}
                </h3>
                <div className="text-xs font-mono text-[#9c9689] uppercase tracking-wider mb-4">
                  {PILLARS_DATA[2].subtitle}
                </div>

                <p className="text-[#c7c0b3] text-sm leading-relaxed mb-6">
                  {PILLARS_DATA[2].lead}
                </p>

                <div className="bg-[#12161d]/80 rounded-2xl p-4 border border-white/5 mb-6 text-xs text-[#b8b0a1] leading-relaxed">
                  <strong className="text-white block font-medium mb-1 font-mono uppercase text-[10px] tracking-wider text-[#e2a96d]">
                    Daya Jangkau Eksekusi:
                  </strong>
                  {PILLARS_DATA[2].scope}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {PILLARS_DATA[2].highlights.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-[#181d24] text-[#e2a96d] border border-[#e2a96d]/30 text-xs font-mono hover:bg-[#e2a96d] hover:text-black transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-2xl font-display font-bold text-white">1,200+</div>
                  <div className="text-[11px] font-mono text-[#9c9689] uppercase">Ton Hasil Bumi / Thn</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playTechClick(600);
                      setSelectedPillarModal(PILLARS_DATA[2]);
                    }}
                    className="px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  >
                    Detail
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInitiateInquiry(PILLARS_DATA[2].title)}
                    className="px-4 py-2 rounded-full bg-[#e2a96d] hover:bg-white text-black text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    <span>Kemitraan Agro</span>
                    <span>↗</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Card 04: Dimensi 04 - Armada & Presisi */}
          {(activeTab === "ALL" || activeTab === "04") && (
            <div
              ref={(el) => registerItem("04", el)}
              data-bento-id="04"
              className={`glass-panel group relative rounded-3xl p-7 sm:p-9 flex flex-col justify-between overflow-hidden border border-[#5affcc]/25 bento-fade-item bento-delay-3 ${
                isItemVisible("04") ? "bento-visible" : ""
              } ${activeTab === "ALL" ? "md:col-span-7" : "md:col-span-12"}`}
            >
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-[#5affcc]/10 blur-3xl pointer-events-none group-hover:bg-[#5affcc]/20 transition-all duration-700"></div>

              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#5affcc]/20 text-[#5affcc] border border-[#5affcc]/40 flex items-center justify-center font-mono font-bold text-xs">
                      04
                    </span>
                    <span className="text-[11px] font-mono tracking-widest text-[#5affcc] uppercase">
                      {PILLARS_DATA[3].badge}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#d8d2c4]">
                    {PILLARS_DATA[3].hookTag}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mb-2 group-hover:text-[#5affcc] transition-colors">
                  {PILLARS_DATA[3].title}
                </h3>
                <div className="text-xs font-mono text-[#9c9689] uppercase tracking-wider mb-4">
                  {PILLARS_DATA[3].subtitle}
                </div>

                <p className="text-[#c7c0b3] text-sm sm:text-base leading-relaxed mb-6">
                  {PILLARS_DATA[3].lead}
                </p>

                <div className="bg-[#12161d]/80 rounded-2xl p-4 border border-white/5 mb-6 text-xs text-[#b8b0a1] leading-relaxed">
                  <strong className="text-white block font-medium mb-1 font-mono uppercase text-[10px] tracking-wider text-[#5affcc]">
                    Daya Jangkau Eksekusi:
                  </strong>
                  {PILLARS_DATA[3].scope}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {PILLARS_DATA[3].highlights.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[#181d24] text-[#5affcc] border border-[#5affcc]/30 text-xs font-mono hover:bg-[#5affcc] hover:text-black transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-display font-bold text-white">24 / 7</div>
                  <div className="text-[11px] font-mono text-[#9c9689] uppercase leading-tight">
                    Kesiapan Operasional<br />&amp; Respon Teknisi
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playTechClick(600);
                      setSelectedPillarModal(PILLARS_DATA[3]);
                    }}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  >
                    Detail Fasilitas
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInitiateInquiry(PILLARS_DATA[3].title)}
                    className="px-4 py-2 rounded-full bg-[#5affcc] hover:bg-white text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>Sewa &amp; Armada</span>
                    <span>↗</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Interactive Inquiry Banner inside Bento with Compelling Hook */}
        <div
          ref={(el) => registerItem("banner", el)}
          data-bento-id="banner"
          className={`mt-8 rounded-3xl bg-gradient-to-r from-[#141a24] via-[#10141a] to-[#171f1a] border border-[#0ae3b0]/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6 bento-fade-item bento-delay-1 ${
            isItemVisible("banner") ? "bento-visible" : ""
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0ae3b0]/15 border border-[#0ae3b0]/40 flex items-center justify-center text-[#0ae3b0] flex-shrink-0">
              <StarIcon className="w-6 h-6 text-[#0ae3b0]" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-display font-bold text-white">
                Butuh Solusi Lintas-Sektor atau Orkestrasi Multi-Dimensi?
              </h4>
              <p className="text-xs sm:text-sm text-[#b2ab9c] mt-0.5">
                Satu sinergi terpadu, standar rekayasa kelas dunia, eksekusi multi-disiplin dari visi konseptual hingga realisasi presisi.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
            <button
              type="button"
              onClick={copyEmail}
              className="w-full md:w-auto px-5 py-3 rounded-full border border-white/20 text-xs font-mono text-[#cfc8bc] hover:border-[#0ae3b0] hover:text-[#0ae3b0] transition-colors"
            >
              Salin Surel: halo@kriya.my.id
            </button>
            <button
              type="button"
              onClick={() => handleInitiateInquiry("Orkestrasi Kemitraan Multi-Dimensi Kriya")}
              className="w-full md:w-auto px-6 py-3 rounded-full bg-[#0ae3b0] text-black text-xs font-mono font-semibold uppercase tracking-wider hover:bg-white transition-colors shadow-md"
            >
              Konsultasi Strategis B2B →
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 4: DETAILED SERVICES & METHODOLOGY */}
      {/* ============================================================== */}
      <section id="layanan" className="relative z-20 py-20 px-6 sm:px-12 md:px-16 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#0ae3b0] uppercase">
              METODOLOGI KRIYA
            </span>
            <h3 className="text-3xl font-display font-bold text-white mt-2 mb-4 leading-tight">
              Dari Konseptualisasi Abstrak Hingga Eksekusi Presisi Tinggi.
            </h3>
            <p className="text-sm text-[#9c9689] leading-relaxed">
              Kami memadukan sensitivitas artistik studio kontemporer dengan kedisiplinan rekayasa teknik mutakhir dan integritas eksekusi teruji.
            </p>
            <div className="mt-6 flex flex-col gap-3 font-mono text-xs text-[#cfc8bc]">
              <div className="flex items-center gap-2">
                <span className="text-[#0ae3b0]">✓</span>
                <span>Kapabilitas Komprehensif &amp; Standar Rekayasa Teruji</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#0ae3b0]">✓</span>
                <span>SLA Dukungan Teknis Terstruktur</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#0ae3b0]">✓</span>
                <span>Integritas Rantai Pasok Berkelanjutan</span>
              </div>
            </div>
          </div>

          {/* Service Matrix Highlights */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#13161c]/70 rounded-2xl p-6 border border-white/5 hover:border-[#0ae3b0]/30 transition-all">
              <div className="text-[#0ae3b0] font-mono text-xs mb-2">01 / REKAYASA DIGITAL</div>
              <h4 className="text-lg font-display font-bold text-white mb-2">Full-Stack &amp; Embedded IoT</h4>
              <p className="text-xs text-[#a39c8f] leading-relaxed">
                Pengembangan aplikasi berbasis web/mobile tingkat lanjut, firmware IoT microcontrollers, serta dashboard analitika waktu nyata.
              </p>
            </div>

            <div className="bg-[#13161c]/70 rounded-2xl p-6 border border-white/5 hover:border-[#9fcaff]/30 transition-all">
              <div className="text-[#9fcaff] font-mono text-xs mb-2">02 / ARSITEKTUR &amp; SPASIAL</div>
              <h4 className="text-lg font-display font-bold text-white mb-2">Perancangan Spasial &amp; Advisory</h4>
              <p className="text-xs text-[#a39c8f] leading-relaxed">
                Dokumentasi DED lengkap, visualisasi 3D fotorealistik, rencana tapak pariwisata terpadu, dan audit efisiensi manufaktur.
              </p>
            </div>

            <div className="bg-[#13161c]/70 rounded-2xl p-6 border border-white/5 hover:border-[#e2a96d]/30 transition-all">
              <div className="text-[#e2a96d] font-mono text-xs mb-2">03 / DISTRIBUSI KOMODITAS</div>
              <h4 className="text-lg font-display font-bold text-white mb-2">Agri-Hub &amp; Rantai Pasok Dingin</h4>
              <p className="text-xs text-[#a39c8f] leading-relaxed">
                Kemitraan langsung dengan kelompok tani kopi, teh, kakao, dan hortikultura, didukung jaminan logistik bersuhu terkontrol.
              </p>
            </div>

            <div className="bg-[#13161c]/70 rounded-2xl p-6 border border-white/5 hover:border-[#5affcc]/30 transition-all">
              <div className="text-[#5affcc] font-mono text-xs mb-2">04 / MANAJEMEN ASET</div>
              <h4 className="text-lg font-display font-bold text-white mb-2">Penyewaan Alat &amp; Maintenance</h4>
              <p className="text-xs text-[#a39c8f] leading-relaxed">
                Fasilitas persewaan kamera sinematik, perangkat audio visual broadcast, armada angkut, dan workshop servis kelistrikan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 5: FOOTER (OFFICIAL BRAND IDENTITY & LOCATION) */}
      {/* ============================================================== */}
      <footer id="studio" className="relative z-20 border-t border-white/10 bg-[#0b0c0e]/95 pt-16 pb-12 px-6 sm:px-12 md:px-16 text-[#8a8478] text-xs font-mono">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#0ae3b0]/40 bg-[#161719] flex items-center justify-center text-[#0ae3b0]">
                <StarIcon className="w-3.5 h-3.5 text-[#0ae3b0]" />
              </div>
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                Kriya Studio<span className="text-[#0ae3b0]">.</span>
              </span>
            </div>
            <p className="text-xs text-[#a09a8d] leading-relaxed max-w-sm">
              Atelier kreatif &amp; holding terpadu rekayasa digital, riset arsitektural, perdagangan agribisnis nusantara, serta manajemen logistik terintegrasi di Indonesia.
            </p>
            <div className="text-[11px] text-[#716c62]">
              Standar Mutu: Seluruh dimensi karya dirancang dan dieksekusi dengan integritas teknis, nilai estetika tinggi, serta keandalan jangka panjang.
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-white font-semibold text-xs tracking-wider uppercase mb-1">
              Empat Dimensi Rekayasa
            </span>
            <a
              href="#dimensi-rekayasa"
              onClick={() => handleTabChange("01")}
              className="hover:text-[#0ae3b0] transition-colors"
            >
              01. Rekayasa Digital &amp; Siber
            </a>
            <a
              href="#dimensi-rekayasa"
              onClick={() => handleTabChange("02")}
              className="hover:text-[#0ae3b0] transition-colors"
            >
              02. Arsitektur &amp; Konsultansi Bisnis
            </a>
            <a
              href="#dimensi-rekayasa"
              onClick={() => handleTabChange("03")}
              className="hover:text-[#0ae3b0] transition-colors"
            >
              03. Perdagangan Komoditas &amp; Agro
            </a>
            <a
              href="#dimensi-rekayasa"
              onClick={() => handleTabChange("04")}
              className="hover:text-[#0ae3b0] transition-colors"
            >
              04. Armada, Logistik &amp; Presisi
            </a>
          </div>

          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-white font-semibold text-xs tracking-wider uppercase mb-1">
              Pusat Korespondensi &amp; Studio
            </span>
            <div>Wilayah Jawa Barat, Republik Indonesia</div>
            <div>Koordinat: 6°49&apos;54.6&quot;S 107°10&apos;17.2&quot;E</div>
            <div className="pt-2">
              Surel Korespondensi:{" "}
              <button
                type="button"
                onClick={copyEmail}
                className="text-[#0ae3b0] underline underline-offset-4 hover:text-white transition-colors"
              >
                halo@kriya.my.id
              </button>
            </div>
            <div className="text-[11px] text-[#6d685e]">
              Jam Operasional Layanan: Senin — Jumat, 09:00 — 18:00 WIB
            </div>
          </div>
        </div>

        {/* Bottom Copyright line */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] tracking-wider uppercase">
          <div>© 2025 KRIYA STUDIO INDONESIA. SELURUH HAK CIPTA DILINDUNGI.</div>
          <div className="flex items-center gap-6">
            <span>PRAKTIK DESAIN INTERAKSI &amp; TATA RUPA</span>
            <span className="text-white/20">•</span>
            <a href="#hero" onClick={() => playTechClick(500)} className="text-[#0ae3b0] hover:underline">
              KEMBALI KE ATAS ↑
            </a>
          </div>
        </div>
      </footer>

      {/* Pillar Detail Modal */}
      <PillarDetailModal
        pillar={selectedPillarModal}
        onClose={() => setSelectedPillarModal(null)}
        onInitiateInquiry={(title) => {
          setSelectedPillarModal(null);
          handleInitiateInquiry(title);
        }}
      />

      {/* Corporate Proposal Modal */}
      <ProposalModal
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        defaultPillar={proposalDefaultPillar}
        onSuccess={(msg) => setToastMessage(msg)}
      />
    </div>
  );
}
