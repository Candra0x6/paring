import { ArrowLeft, FileText, Clock, Activity, ShieldCheck, Video, Heart, Wifi, Battery, Signal } from 'lucide-react';
import { motion } from 'motion/react';

export default function VisitScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="w-[350px] h-[750px] bg-[#F8FAFC] rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative border-[8px] border-white/80 shrink-0"
    >
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 z-50 text-white bg-[#37A47C]">
        <span className="text-[13px] font-semibold tracking-wide">9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal size={14} className="fill-white" />
          <Wifi size={14} />
          <Battery size={16} className="fill-white" />
        </div>
      </div>

      {/* Blue Background Top */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: 80 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#37A47C] absolute top-0 left-0 right-0 z-0"
      />

      {/* Header */}
      <div className="pt-16 px-6 pb-4 flex items-center gap-4 bg-[#F8FAFC] z-10 rounded-t-[40px] mt-10 relative">
        <motion.div whileHover={{ scale: 1.1, x: -2 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 shrink-0 cursor-pointer">
          <ArrowLeft size={20} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h1 className="text-[17px] font-bold text-slate-800 leading-tight tracking-wide">Upcoming video visit</h1>
          <p className="text-slate-400 text-[11px] font-semibold mt-0.5">10 Oct, 10:30 am</p>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-28 relative z-10">
        {/* Symptoms Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(55, 164, 124, 0.4)" }}
          className="bg-gradient-to-br from-[#6A9DF4] to-[#37A47C] rounded-[28px] p-5 text-white mb-6 shadow-lg shadow-[#37A47C]/20 relative overflow-hidden cursor-pointer"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"
          />
          <div className="flex gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0 border border-white/10">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold mb-1 tracking-wide">Symptoms</h2>
              <p className="text-[#E2F1EC] text-xs mb-3 font-medium">Let doctor know in advance</p>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3.5 h-3.5 rounded-full bg-white/30 flex items-center justify-center"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </motion.div>
                Fill in for 5 min
              </div>
            </div>
          </div>
        </motion.div>

        {/* Doctor Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          whileHover={{ scale: 1.02, x: 5 }}
          className="flex items-center gap-4 mb-6 bg-white p-4 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer"
        >
          <img src="https://i.pravatar.cc/150?u=kevin" alt="Doctor" className="w-[52px] h-[52px] rounded-[18px] object-cover bg-[#37A47C]/10" />
          <div>
            <h3 className="font-bold text-slate-800 text-[15px] tracking-wide">Kevin Bernard, MD</h3>
            <div className="flex items-center text-slate-500 text-xs font-semibold mt-1">
              <Heart size={12} className="text-red-500 fill-red-500 mr-1.5" /> Cardiologist
            </div>
          </div>
        </motion.div>

        {/* How to prepare */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          className="bg-white rounded-[28px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-4"
        >
          <h3 className="text-[16px] font-bold text-slate-800 mb-5 tracking-wide">How to prepare?</h3>
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.8 } }
            }}
            className="flex flex-col gap-5 relative"
          >
            {/* Connecting line */}
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
              className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-slate-100 z-0 rounded-full"
            />
            
            {[
              { icon: Clock, title: '30 min', desc: 'The consultation will take' },
              { icon: FileText, title: 'Medical Anamnesis', desc: 'Prepare your previous examinations' },
              { icon: Activity, title: 'Blood tests', desc: 'Prepare your blood tests results' },
              { icon: ShieldCheck, title: 'Insurance', desc: '30% discount with an insurance' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                whileHover={{ x: 5 }}
                className="flex gap-4 relative z-10 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#37A47C] shrink-0 border-4 border-white group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                  <item.icon size={18} />
                </div>
                <div className="pt-1">
                  <h4 className="font-bold text-slate-800 text-[13px] mb-0.5 tracking-wide group-hover:text-[#37A47C] transition-colors">{item.title}</h4>
                  <p className="text-slate-400 text-[11px] font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Button */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1 }}
        className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] to-transparent z-20"
      >
        <motion.button 
          whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(55, 164, 124, 0.5)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#37A47C] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#37A47C]/30 flex items-center justify-center gap-2 tracking-wide"
        >
          <Video size={18} />
          Join a conversation
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
