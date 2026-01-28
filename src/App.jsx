import { useState, useEffect, useRef } from 'react'
import { processSplit } from './api'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function App() {
  const [mode, setMode] = useState('split')
  const [pdf, setPdf] = useState(null)
  const [pdfPreview, setPdfPreview] = useState(null)
  const [excel, setExcel] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      easing: 'ease-out-cubic',
      anchorPlacement: 'top-bottom',
    })

    return () => {
      if (pdfPreview) URL.revokeObjectURL(pdfPreview)
    }
  }, [pdfPreview])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const handlePdfChange = (e) => {
    const file = e.target.files[0]
    setError(null)
    setSuccess(null)

    if (file) {
      if (file.type === 'application/pdf') {
        setPdf(file)
        const previewUrl = URL.createObjectURL(file)
        setPdfPreview(previewUrl)
        setTimeout(() => AOS.refresh(), 200)
      } else {
        setError('File Yang kamu Upload Salah atau tidak Sama!')
        setPdf(null)
        setPdfPreview(null)
        e.target.value = ''
      }
    }
  }

  const handleExcelChange = (e) => {
    const file = e.target.files[0]
    setError(null)
    setSuccess(null)

    if (file) {
      const allowedExtensions = /(\.xlsx|\.xls)$/i
      if (allowedExtensions.exec(file.name)) {
        setExcel(file)
      } else {
        setError('File Yang kamu Upload Salah atau tidak Sama!')
        setExcel(null)
        e.target.value = ''
      }
    }
  }

  const submit = async () => {
    setError(null)
    setSuccess(null)

    if (!pdf) return setError('File Yang kamu Upload Salah atau tidak Sama!')
    if (mode === 'rename' && !excel) return setError('File Yang kamu Upload Salah atau tidak Sama!')

    setLoading(true)
    try {
      const blob = await processSplit({ mode, pdf, excel })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'splitora-result.zip'
      a.click()
      URL.revokeObjectURL(url)

      setSuccess('Proses berhasil. File berhasil diunduh.')
    } catch (e) {
      setError(e.message || 'Terjadi kegagalan sistem. Coba lagi nanti.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#03060a] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      
      {/* HIGH VISIBILITY BACKGROUND: Perspective Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Central Glow */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-cyan-600/20 blur-[150px] rounded-full opacity-70" />
        
        {/* Visible Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.4]" 
          style={{
            backgroundImage: `linear-gradient(to right, #334155 1.5px, transparent 1.5px), linear-gradient(to bottom, #334155 1.5px, transparent 1.5px)`,
            backgroundSize: '70px 70px',
            perspective: '800px',
            transform: 'rotateX(55deg) translateY(-120px) translateZ(0)',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 90%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#03060a]/50 to-[#03060a]" />
      </div>

      <main className="relative z-10 pt-20">
        
        {/* 2. HERO SECTION */}
        <section className="pb-12 px-6 text-center max-w-5xl mx-auto space-y-8">
          <div data-aos="fade-down" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-[10px] font-bold text-cyan-400 tracking-[0.2em] uppercase mb-4 shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Neural Engine Active
          </div>
          <h1 data-aos="zoom-in" className="text-6xl md:text-8xl font-black tracking-tight text-white leading-[0.95] drop-shadow-lg">
            Automate your <br />
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-300 to-cyan-500 bg-clip-text text-transparent italic">PDF Workflow.</span>
          </h1>
          <p data-aos="fade-up" className="max-w-2xl mx-auto text-slate-300 text-base md:text-xl leading-relaxed font-light">
            Pengolah dokumen berbasis AI yang presisi. Pisahkan, namai ulang, dan kelola aset digital dengan keamanan tingkat tinggi.
          </p>
          <div data-aos="fade-up" data-aos-delay="200" className="flex flex-wrap justify-center gap-4 pt-6">
             <a href="#engine" className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-[#03060a] font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-105 transition-all">Start Engine</a>
             <a href="#features" className="px-10 py-4 bg-white/[0.05] backdrop-blur-md border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/[0.1] transition-all">Features</a>
          </div>
        </section>

        {/* 3. WORKFLOW CARDS (scroll-mt-32 untuk navigasi presisi) */}
        <section id="how-it-works" className="py-24 px-6 max-w-5xl mx-auto scroll-mt-32">
          <div className="relative grid md:grid-cols-3 gap-12 text-center">
            {[
              { id: '01', title: 'Ingest', desc: 'Upload PDF source ke dalam engine enkripsi.' },
              { id: '02', title: 'Logic', desc: 'Pilih mode split atau integrasi pemetaan Excel.' },
              { id: '03', title: 'Deploy', desc: 'Eksekusi proses dan unduh hasil paket ZIP.' }
            ].map((step, i) => (
              <div 
                key={i} 
                data-aos="fade-up" 
                className="relative group p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:bg-white/[0.06] transition-all duration-500"
              >
                <div className="text-4xl font-black text-white/10 absolute top-4 right-6 group-hover:text-cyan-500/30 transition-colors">{step.id}</div>
                <h4 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">{step.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. CORE ENGINE SECTION (scroll-mt-32 memperbaiki posisi scroll) */}
        <section id="engine" className="py-20 px-6 relative scroll-mt-32" data-aos="zoom-in-up">
          <div className="max-w-2xl mx-auto bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent group-hover:via-cyan-400 transition-all duration-700" />
            
            <div className="p-10 md:p-14 space-y-12">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Mode Selection</label>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Encrypted v2.0</span>
                </div>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/50 border border-white/5 rounded-2xl">
                  <button 
                    onClick={() => setMode('split')}
                    className={`py-3.5 text-[11px] font-black rounded-xl transition-all duration-300 uppercase tracking-widest ${mode === 'split' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Split PDF
                  </button>
                  <button 
                    onClick={() => setMode('rename')}
                    className={`py-3.5 text-[11px] font-black rounded-xl transition-all duration-300 uppercase tracking-widest ${mode === 'rename' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Rename PDF
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {!pdfPreview ? (
                  <div className="group relative h-60 flex flex-col items-center justify-center border border-white/10 rounded-[2.5rem] bg-white/[0.02] hover:bg-cyan-500/[0.05] hover:border-cyan-500/40 transition-all duration-700 cursor-pointer overflow-hidden backdrop-blur-sm">
                    <input ref={fileInputRef} type="file" accept="application/pdf" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handlePdfChange} />
                    <div className="w-16 h-16 bg-white/[0.05] border border-white/10 rounded-2xl flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-cyan-400 transition-all duration-500 mb-5 shadow-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">Upload Asset PDF</span>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-700">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Neural Preview</label>
                      {/* MODIFIKASI: Klik Eject akan menghapus PDF dan Excel */}
                      <button onClick={() => {setPdf(null); setPdfPreview(null); setExcel(null);}} className="text-[10px] text-red-400 font-black uppercase hover:text-red-300 transition-colors">Eject</button>
                    </div>
                    <div className="h-72 rounded-[2.5rem] border border-white/10 overflow-hidden bg-black/80 shadow-inner relative group">
                      <iframe src={`${pdfPreview}#toolbar=0`} className="w-full h-full opacity-50 grayscale hover:grayscale-0 hover:opacity-90 transition-all duration-1000" title="PDF Preview" />
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  </div>
                )}

                {mode === 'rename' && (
                  <div className="space-y-3 animate-in slide-in-from-top-4 duration-500">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Logic Mapping (Excel)</label>
                    <div className="relative group p-5 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-sm flex items-center gap-5 hover:border-cyan-500/40 transition-all cursor-pointer">
                      <input type="file" accept=".xlsx,.xls" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleExcelChange} />
                      <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <span className="text-xs font-bold text-white truncate flex-1 tracking-tight">{excel ? excel.name : 'Select Dataset (.xlsx)'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* AREA PEMBERITAHUAN ERROR - TEPAT DI ATAS BUTTON */}
              <div className="flex flex-col gap-4">
                {error && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-[11px] font-bold uppercase tracking-wider">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[11px] font-bold uppercase tracking-wider">{success}</span>
                  </div>
                )}

                <button
                  onClick={submit}
                  disabled={loading}
                  className="group relative w-full h-16 rounded-[1.5rem] font-black text-[#03060a] text-[12px] uppercase tracking-[0.4em] transition-all active:scale-[0.98] disabled:opacity-40 overflow-hidden shadow-[0_20px_45px_rgba(34,211,238,0.3)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 group-hover:scale-110 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#03060a]/30 border-t-[#03060a] rounded-full animate-spin" />
                        Node Processing...
                      </>
                    ) : (
                      <>
                        Run Logic Engine
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-[3.5px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. STATS SECTION */}
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto space-y-24 scroll-mt-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Uptime', val: '99.9%' },
              { label: 'Accuracy', val: '100%' },
              { label: 'Latency', val: '0.2ms' },
              { label: 'Secure', val: 'AES-256' }
            ].map((stat, i) => (
              <div 
                key={i} 
                data-aos="flip-up" 
                className="text-center p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-xl"
              >
                <div className="text-2xl md:text-4xl font-black text-white mb-2">{stat.val}</div>
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/60 backdrop-blur-md pt-20 pb-10 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 mb-16">
          <div data-aos="fade-right" className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-white text-[#03060a] rounded-lg flex items-center justify-center font-black italic">S</div>
              <span className="font-black text-lg tracking-tighter text-white uppercase">Splitora</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold">Secure Processing Node</p>
          </div>
          <div data-aos="fade-left" className="flex gap-12 text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-cyan-400 transition-all text-cyan-400">Security</a>
            <a href="#" className="hover:text-cyan-400 transition-all">Support</a>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.5em]">© 2026 SPLITORA by W4HYOU</p>
        </div>
      </footer>
    </div>
  )
}