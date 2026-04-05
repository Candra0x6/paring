'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Heart, Shield, Clock, Phone, MapPin, Search,
  ArrowRight, CheckCircle2, Star, Calendar, User, ChevronDown
} from 'lucide-react';
import Image from 'next/image';

const fadeUpVariant: any = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function LandingPage() {
  const router = useRouter();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', patient: '', service: '' });

  useEffect(() => {
    const token = localStorage.getItem('paring_auth_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) return;

    const message = `Halo Admin PARING,\nSaya ingin tanya terkait layanan homecare:\n\nNama Pemesan: ${bookingForm.name}\nNomor HP: ${bookingForm.phone}\nNama Lansia: ${bookingForm.patient || '-'}\nLayanan Diminati: ${bookingForm.service || '-'}\n\nMohon informasi selanjutnya. Terima kasih.`;
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    setIsBookingModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-sans text-slate-800 overflow-x-hidden">

      {/* 1. Header & Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50 bg-[#FBF9F6]/80 backdrop-blur-xl border-b border-[#37A47C]/10"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">

            <div>
              <span className="block font-serif font-bold text-2xl tracking-tight text-[#1B4332] leading-none">PARING</span>
              <span className="block text-[10px] font-bold tracking-widest text-[#37A47C] uppercase">Homecare Lansia</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Tentang Kami', 'Layanan', 'Cara Kerja', 'Testimoni'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-slate-600 font-medium hover:text-[#37A47C] transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#37A47C] rounded-full transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsBookingModalOpen(true)} className="hidden md:flex text-slate-600 font-medium hover:text-[#37A47C] transition-colors">
              Konsultasi
            </button>
            <Button onClick={() => router.push('/login')} variant="primary" className="rounded-full shadow-xl shadow-[#37A47C]/20 border border-[#37A47C]/20">
              Masuk
            </Button>
          </div>
        </div>
      </motion.nav>

      <main className="pt-20">
        {/* 2. Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-10 pb-20 overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E2F1EC] rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/4 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FAF3E0] rounded-full blur-3xl opacity-60 -translate-x-1/4 translate-y-1/3 -z-10"></div>

          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#37A47C]/10 text-[#37A47C] font-bold text-sm mb-6 border border-[#37A47C]/20">
                <span className="w-2 h-2 rounded-full bg-[#37A47C] animate-pulse"></span>
                Tersedia di Kota Solo & Sekitarnya
              </motion.div>

              <motion.h1
                variants={fadeUpVariant}
                className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-[#1B4332] mb-6 tracking-tight"
              >
                Homecare yang <span className="text-[#37A47C] italic">Anda Rancang,</span> <br />
                Perawatan yang <span className="relative">
                  Kami Jamin.
                  <svg className="absolute w-full h-4 -bottom-1 left-0 text-[#E2F1EC] -z-10" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,10 Q50,20 100,10 L100,20 L0,20 Z" fill="currentColor" /></svg>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUpVariant}
                className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-light"
              >
                Platform digital pertama yang menghubungkan keluarga dengan perawat profesional tersertifikasi. Dilengkapi dengan pemantauan real-time dan tombol darurat untuk ketenangan Anda 24/7.
              </motion.p>

              <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => router.push('/register')} className="h-14 px-8 text-lg rounded-full shadow-2xl shadow-[#37A47C]/30 bg-[#37A47C] hover:bg-[#1B4332]">
                  Daftar Sekarang
                </Button>
                <Button onClick={() => setIsBookingModalOpen(true)} variant="outline" className="h-14 px-8 text-lg rounded-full border-[#37A47C]/20 text-[#37A47C] hover:bg-[#37A47C]/5">
                  <Phone size={20} className="mr-2" />
                  Konsultasi WhatsApp
                </Button>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="mt-12 flex items-center gap-6 pt-8 border-t border-slate-200/60">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#FBF9F6] bg-slate-200 overflow-hidden relative">
                      <div className="absolute inset-0 bg-[#E2F1EC] flex items-center justify-center">
                        <User size={16} className="text-[#37A47C]" />
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#F59E0B]">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-sm text-slate-500 font-medium mt-1">Dipercaya oleh 50+ Keluarga</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Elegant mockup / abstract visual representing the app */}
              <div className="relative w-full aspect-[4/5] bg-white rounded-[2.5rem] p-4 shadow-[0_20px_60px_-15px_rgba(55,164,124,0.15)] border border-[#37A47C]/10 overflow-hidden transform md:rotate-3 transition-transform hover:rotate-0 duration-700">
                <div className="absolute inset-0 rounded-[2rem] border-[8px] border-[#F8FAFC]"></div>
                <div className="w-full h-full bg-[#FBF9F6] rounded-[1.5rem] overflow-hidden flex flex-col items-center justify-center relative">

                  {/* Decorative Organic Shapes inside the mockup */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E2F1EC] to-transparent rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#FAF3E0] to-transparent rounded-full blur-2xl"></div>

                  <div className="w-20 h-20 bg-[#37A47C] rounded-[2rem] shadow-lg flex items-center justify-center mb-8 rotate-12 relative z-10">
                    <Heart size={40} className="text-white" />
                  </div>
                  <h3 className="font-serif text-3xl text-center text-[#1B4332] font-medium leading-tight mb-4 relative z-10">Care starts<br />at home</h3>

                  {/* Fake UI elements to simulate the app monitoring */}
                  <div className="w-3/4 max-w-[280px] bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50 relative z-10 mb-4 transform -rotate-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"><Heart size={16} className="text-red-400" /></div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">Tekanan Darah</div>
                        <div className="text-xs text-slate-500">Baru saja oleh Ners Rina</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#1B4332] font-serif">120/80 <span className="text-sm font-sans text-slate-400 font-normal">mmHg</span></div>
                  </div>

                  <div className="w-3/4 max-w-[280px] bg-[#ff4d4f] rounded-2xl p-4 shadow-lg shadow-red-500/20 relative z-10 transform translate-x-4">
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Shield size={20} />
                      </div>
                      <div className="font-bold tracking-wide">TOMBOL DARURAT</div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. Value Props (Keunggulan) */}
        <section id="tentang-kami" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="text-[#37A47C] font-bold tracking-widest text-sm uppercase mb-3">Keunggulan PARING</h2>
              <h3 className="font-serif text-4xl lg:text-5xl font-bold text-[#1B4332] leading-tight">Standar Baru Perawatan di Rumah</h3>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield size={28} className="text-[#37A47C]" />,
                  title: "Perawat Tersertifikasi",
                  desc: "Setiap perawat melewati proses verifikasi ketat (STR & sertifikasi pendukung) oleh tim medis kami."
                },
                {
                  icon: <Clock size={28} className="text-[#37A47C]" />,
                  title: "Pemantauan Real-Time",
                  desc: "Lihat hasil pemeriksaan kesehatan (Tensi, Gula Darah, Suhu) lansia Anda secara langsung dari aplikasi saat sesi berlangsung."
                },
                {
                  icon: <Heart size={28} className="text-[#ff4d4f]" />,
                  title: "Tombol Darurat (Panic Button)",
                  desc: "Satu sentuhan untuk mengirim notifikasi WhatsApp instan ke keluarga, perawat, dan admin saat keadaan krisis."
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-[#FBF9F6] border border-[#37A47C]/5 p-8 rounded-[2rem] hover:shadow-[0_20px_40px_-15px_rgba(55,164,124,0.1)] transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#E2F1EC] transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#1B4332] mb-3">{feature.title}</h4>
                  <p className="text-slate-600 leading-relaxed font-light">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Services (Layanan) */}
        <section id="layanan" className="py-24 bg-[#E2F1EC] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="flex justify-between items-end mb-16"
            >
              <div className="max-w-xl">
                <h2 className="text-[#37A47C] font-bold tracking-widest text-sm uppercase mb-3">Layanan Kami</h2>
                <h3 className="font-serif text-4xl lg:text-5xl font-bold text-[#1B4332] leading-tight">Fleksibilitas Sesuai Kebutuhan</h3>
              </div>
              <Button onClick={() => router.push('/register')} variant="outline" className="hidden md:flex bg-transparent border-[#37A47C] text-[#1B4332] hover:bg-[#37A47C] hover:text-white rounded-full">
                Lihat Semua Layanan
              </Button>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Perawat · Visit",
                  badge: "Medis",
                  price: "Rp 100.000 / kunjungan",
                  desc: "Kunjungan perawat medis ke rumah untuk pengecekan rutin harian. Cocok untuk pemantauan berkala.",
                  items: [
                    "Cek Tekanan Darah (TTV)",
                    "Cek Gula Darah",
                    "Cek Kolesterol",
                    "Cek Asam Urat"
                  ],
                  note: "*Harga dapat disesuaikan"
                },
                {
                  title: "Perawat · Live-Out",
                  badge: "Medis",
                  price: "Rp 200.000 / shift",
                  desc: "Pendampingan medis seharian penuh dengan tindakan perawatan. Ideal untuk pasien dengan kebutuhan khusus.",
                  items: [
                    "Cek Tekanan Darah (TTV)",
                    "Cek Gula Darah",
                    "Cek Kolesterol & Asam Urat",
                    "ROM & ADL",
                    "Perawatan Infus Vit C",
                    "Perawatan Luka Biasa",
                    "Injeksi Insulin"
                  ],
                  note: "*Harga dapat disesuaikan",
                  highlight: true
                },
                {
                  title: "Perawat · Live-In",
                  badge: "Medis",
                  price: "Rp 350.000 / hari",
                  desc: "Perawat tinggal bersama pasien 24 jam. Mencakup semua tindakan medis termasuk luka kompleks.",
                  items: [
                    "Cek TTV, Gula, Kolesterol & Asam Urat",
                    "ROM & ADL",
                    "Infus Vit C & Injeksi Insulin",
                    "Perawatan Luka Biasa & Gangren",
                    "Perawatan Luka Kolostomi & NGT",
                    "Pasang Kateter"
                  ],
                  note: "*Harga dapat disesuaikan"
                },
                {
                  title: "Caregiver",
                  badge: "Non-Medis",
                  price: "Mulai Rp 50.000",
                  desc: "Pendampingan aktivitas harian, kebugaran fisik ringan, dan dukungan emosional untuk lansia.",
                  items: [
                    "ADL — Rp 50.000",
                    "Light Physical Activity — Rp 150.000",
                    "Emotional Support & Active Listening — Rp 100.000"
                  ],
                  note: "*Harga dapat disesuaikan"
                }
              ].map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`p-8 rounded-[2rem] border relative overflow-hidden flex flex-col ${service.highlight ? 'bg-[#1B4332] border-transparent text-white shadow-2xl shadow-[#1B4332]/30' : 'bg-white border-[#37A47C]/10 text-slate-800'}`}
                >
                  {service.highlight && (
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#37A47C] rounded-full blur-2xl opacity-20"></div>
                  )}

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className={`font-serif text-xl font-bold leading-tight ${service.highlight ? 'text-white' : 'text-[#1B4332]'}`}>{service.title}</h4>
                    {service.badge && (
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full shrink-0 ${service.highlight ? 'bg-white/20 text-white' : 'bg-[#E2F1EC] text-[#37A47C]'}`}>
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <div className={`text-sm font-bold mb-5 px-3 py-1 inline-block rounded-full ${service.highlight ? 'bg-[#37A47C] text-white' : 'bg-[#E2F1EC] text-[#37A47C]'}`}>
                    {service.price}
                  </div>

                  <p className={`mb-6 font-light leading-relaxed text-sm ${service.highlight ? 'text-slate-300' : 'text-slate-600'}`}>{service.desc}</p>

                  <ul className="space-y-3 mb-6 flex-1">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-[#37A47C] mt-0.5 shrink-0" />
                        <span className={`text-sm leading-snug ${service.highlight ? 'text-slate-200' : 'text-slate-700'}`}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {service.note && (
                    <p className={`text-xs mb-4 italic ${service.highlight ? 'text-slate-400' : 'text-slate-400'}`}>{service.note}</p>
                  )}

                  <Button onClick={() => setIsBookingModalOpen(true)} className={`w-full justify-center text-[#1B4332] rounded-xl h-12 `}>
                    Pesan Sekarang
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. How It Works (Cara Kerja) */}
        <section id="cara-kerja" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="text-[#37A47C] font-bold tracking-widest text-sm uppercase mb-3">Cara Kerja</h2>
              <h3 className="font-serif text-4xl lg:text-5xl font-bold text-[#1B4332] leading-tight">4 Langkah Merawat yang Tersayang</h3>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-slate-100"></div>

              {[
                { step: "01", title: "Registrasi & Profil", desc: "Buat akun keluarga dan lengkapi data profil kesehatan lansia Anda." },
                { step: "02", title: "Pilih Perawat", desc: "Cari perawat yang terverifikasi dan sesuai dengan kebutuhan khusus pasien." },
                { step: "03", title: "Booking & Bayar", desc: "Pilih layanan, tentukan jadwal, dan selesaikan pembayaran dengan aman." },
                { step: "04", title: "Pantau Real-Time", desc: "Lihat hasil pemeriksaan selama sesi berjalan langsung dari aplikasi." }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="relative text-center"
                >
                  <div className="w-24 h-24 mx-auto bg-white border-8 border-[#FBF9F6] rounded-full flex items-center justify-center font-serif text-3xl font-bold text-[#1B4332] shadow-sm relative z-10 mb-6 group hover:border-[#E2F1EC] transition-colors">
                    {item.step}
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#1B4332] mb-3">{item.title}</h4>
                  <p className="text-slate-500 font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Testimoni */}
        <section id="testimoni" className="py-24 bg-[#FBF9F6] relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="text-[#37A47C] font-bold tracking-widest text-sm uppercase mb-3">Apa Kata Mereka</h2>
              <h3 className="font-serif text-4xl lg:text-5xl font-bold text-[#1B4332] leading-tight">Kepercayaan Anda, Prioritas Kami</h3>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Bpk. Hendra", role: "Menggunakan Live-Out Care", quote: "Pelayanan PARING sangat membantu saya yang sibuk kerja. Ners Siti sangat sabar merawat ibu saya. Ada notif real-time di HP bikin tenang saat di kantor." },
                { name: "Ibu Rina", role: "Menggunakan Visit Care", quote: "Tombol daruratnya benar-benar menyelamatkan nyawa saat ayah saya sesak napas. Respon adminnya luar biasa cepat. Sangat direkomendasikan!" },
                { name: "Kel. Kusuma", role: "Menggunakan Live-In Care", quote: "Sulit mencari perawat lansia yang bisa dipercaya. Sejak pakai PARING, kualitas hidup Eyang meningkat tajam karena dirawat secara pro dan terpantau terus." }
              ].map((testi, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
                >
                  <div className="text-[#37A47C] mb-6">
                    Meskipun saya sibuk...
                    <svg className="w-10 h-10 text-[#E2F1EC] mb-4" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-1.1.9-2 2-2h2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-1.1.9-2 2-2h2V8z" /></svg>
                  </div>
                  <p className="text-slate-600 font-light leading-relaxed mb-8 italic">"{testi.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E2F1EC] rounded-full flex items-center justify-center font-serif font-bold text-[#1B4332] opacity-80">
                      {testi.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-[#1B4332]">{testi.name}</h5>
                      <span className="text-xs text-[#37A47C]">{testi.role}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. FAQ Section */}
        <section className="py-24 bg-white relative">
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="text-center mb-16"
            >
              <h2 className="text-[#37A47C] font-bold tracking-widest text-sm uppercase mb-3">FAQ</h2>
              <h3 className="font-serif text-4xl font-bold text-[#1B4332] leading-tight">Pertanyaan yang Sering Diajukan</h3>
            </motion.div>

            <div className="space-y-4">
              {[
                { q: "Apakah perawat PARING sudah terverifikasi?", a: "Ya, semua perawat kami telah melalui proses seleksi ketat, memiliki Surat Tanda Registrasi (STR) perawat yang aktif, serta sertifikasi tambahan (seperti BTCLS) yang divalidasi oleh tim medis internal kami." },
                { q: "Bagaimana cara kerja tombol darurat (Panic Button)?", a: "Saat ditekan, sistem otomatis mengirimkan pesan WhatsApp ke 3 pihak sekaligus dalam hitungan detik: narahubung keluarga, perawat yang bertugas, dan admin PARING (yang akan segera menghubungi bantuan seperti RS/ambulans)." },
                { q: "Apakah saya bisa memantau kondisi pasien dari kantor?", a: "Sangat bisa. Melalui fitur Real-Time Dashboard, Anda bisa melihat metrik kesehatan (Tensi, Suhu, dll) yang di-update langsung oleh perawat saat itu juga." },
                { q: "Bagaimana sistem pembayarannya?", a: "Pembayaran dilakukan setelah harga booking dikonfirmasi oleh perawat. Anda bisa membayar secara otomatis menggunakan transfer bank, kartu kredit, atau e-wallet melalui platform Midtrans sebelum sesi dimulai." }
              ].map((faq, idx) => (
                <details key={idx} className="group bg-[#FBF9F6] border border-slate-100 rounded-2xl p-6 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-[#1B4332]">
                    <span>{faq.q}</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDown size={20} className="text-[#37A47C]" />
                    </span>
                  </summary>
                  <p className="text-slate-600 font-light leading-relaxed mt-4 pt-4 border-t border-slate-200">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Mitra Perawat Banner */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto bg-[#E2F1EC] rounded-[3rem] p-10 lg:p-16 text-center shadow-inner border border-[#37A47C]/10">
            <h3 className="font-serif text-3xl font-bold text-[#1B4332] mb-4">Anda Seorang Perawat Profesional?</h3>
            <p className="text-slate-600 font-light max-w-2xl mx-auto mb-8">
              Bergabunglah dengan PARING. Dapatkan fleksibilitas waktu, transparansi laporan dengan standar medis terkini, dan peningkatan profesionalisme.
            </p>
            <Button onClick={() => router.push('/register?role=nurse')} variant="outline" className="h-12 border-[#37A47C] text-[#37A47C] mx-auto hover:bg-[#37A47C] hover:text-white rounded-full transition-colors">
              Daftar Sebagai Mitra Perawat
            </Button>
          </div>
        </section>

        {/* CTA Banner Section */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto bg-[#1B4332] rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#37A47C] rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 max-w-2xl">
              <h3 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">Mulai Rawat Lansia Anda Hari Ini</h3>
              <p className="text-slate-300 font-light text-lg mb-8 leading-relaxed">
                Bergabunglah dengan ekosistem kesehatan PARING dan berikan perawatan terbaik dengan ketenangan pikiran penuh untuk keluarga Anda.
              </p>
              <Button onClick={() => router.push('/register')} className="h-14 px-8 text-lg rounded-full bg-white text-[#1B4332] shadow-none hover:bg-[#E2F1EC]">
                Daftar & Buat Profil Gratis
                <ArrowRight size={20} />
              </Button>
            </div>

            <div className="relative z-10 hidden lg:block w-72 h-72">
              <div className="absolute inset-0 border border-white/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 border border-white/10 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-[#37A47C] rounded-[2rem] rotate-12 flex items-center justify-center shadow-2xl">
                  <Shield size={60} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#FBF9F6] border-t border-slate-200/50 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#1B4332] rounded-xl flex items-center justify-center text-white">
                <Heart size={20} />
              </div>
              <span className="font-serif font-bold text-2xl text-[#1B4332]">PARING</span>
            </div>
            <p className="text-slate-500 font-light mb-8 max-w-sm leading-relaxed">
              Homecare yang Anda rancang, perawatan yang kami jamin. Integrasi teknologi dan personal touch untuk orang terkasih.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <p className="text-sm font-medium">Bagian dari program P2MW 2026</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#1B4332] mb-6">Menu Utama</h4>
            <ul className="space-y-4 text-slate-500 font-light">
              <li><a href="#layanan" className="hover:text-[#37A47C]">Layanan Kami</a></li>
              <li><a href="#cara-kerja" className="hover:text-[#37A47C]">Cara Kerja</a></li>
              <li><a href="#tentang-kami" className="hover:text-[#37A47C]">Tentang Kami</a></li>
              <li><a onClick={() => router.push('/dashboard')} className="hover:text-[#37A47C] cursor-pointer">Masuk Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#1B4332] mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-slate-500 font-light">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-[#37A47C]" />
                <span>Kota Surakarta, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#37A47C]" />
                <span>+62 812-3456-7890</span>
              </li>
              <li>
                <Button onClick={() => setIsBookingModalOpen(true)} variant="outline" className="mt-4 border-[#37A47C]/30 text-[#37A47C] rounded-full h-10 text-xs px-4 bg-transparent w-full justify-center hover:bg-[#37A47C]/5">
                  Tanya Admin (WhatsApp)
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center border-t border-slate-200/50 pt-8 text-slate-400 text-sm font-light">
          &copy; {new Date().getFullYear()} PARING Homecare Platform. Hak Cipta Dilindungi Undang-Undang.
        </div>
      </footer>

      {/* Manual Booking / Consultation Modal (Sprint 1) */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
          >
            <button onClick={() => setIsBookingModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            <div className="mb-8 relative z-10">
              <div className="w-12 h-12 bg-[#E2F1EC] text-[#37A47C] rounded-xl flex items-center justify-center mb-4">
                <Phone size={24} />
              </div>
              <h3 className="font-serif text-3xl font-bold text-[#1B4332] mb-2">Konsultasi Layanan</h3>
              <p className="text-slate-500 font-light">Tinggalkan data pemesanan awal, Admin PARING akan menghubungi Anda dalam 5 menit melalui WhatsApp untuk konfirmasi detail.</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Nama Pemesan / Keluarga <span className="text-red-500">*</span></label>
                <Input
                  required
                  placeholder="Mis. Budi Santoso"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  className="bg-[#FBF9F6] rounded-xl text-md"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Nomor WhatsApp <span className="text-red-500">*</span></label>
                <Input
                  required
                  type="tel"
                  placeholder="0812xxxxxx"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  className="bg-[#FBF9F6] rounded-xl text-md"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Nama Lansia (Pasien)</label>
                <Input
                  placeholder="Mis. Ibu Kartini"
                  value={bookingForm.patient}
                  onChange={(e) => setBookingForm({ ...bookingForm, patient: e.target.value })}
                  className="bg-[#FBF9F6] rounded-xl text-md"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Layanan yang Diminati</label>
                <div className="relative">
                  <select
                    value={bookingForm.service}
                    onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })}
                    className="w-full h-12 px-4 bg-[#FBF9F6] border border-slate-200 rounded-xl focus:outline-none focus:border-[#37A47C] transition-colors text-slate-800 appearance-none text-md"
                  >
                    <option value="">Pilih Layanan (Opsional)</option>
                    <option value="Visit Care">Visit Care (Kunjungan)</option>
                    <option value="Live-Out Care">Live-Out Care (Per Shift)</option>
                    <option value="Live-In Care">Live-In Care (24 Jam)</option>
                    <option value="Belum Yakin / Konsultasi">Belum Yakin / Hanya Konsultasi</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full h-14 justify-center text-lg bg-[#37A47C] hover:bg-[#1B4332] rounded-xl shadow-lg shadow-[#37A47C]/20">
                  <Phone size={20} />
                  Mulai Konsultasi WhatsApp
                </Button>
              </div>
            </form>

            {/* Decorative BG element in modal */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#E2F1EC] rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
