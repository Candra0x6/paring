import { Phone, Building2, Pill, Search, Settings, Home, Users, Heart, Star, Calendar, Grid2X2, Wifi, Battery, Signal } from 'lucide-react';
import { motion } from 'motion/react';

export default function HomeScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="w-[350px] h-[750px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative border-[8px] border-white/80 shrink-0"
    >
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 z-50 text-white">
        <span className="text-[13px] font-semibold tracking-wide">9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal size={14} className="fill-white" />
          <Wifi size={14} />
          <Battery size={16} className="fill-white" />
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-[#37A47C] pt-14 pb-24 px-6 rounded-b-[40px] relative z-0 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"
        />
        <div className="flex justify-between items-center mb-8 relative z-10">
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm cursor-pointer">
            <Grid2X2 size={20} className="text-white" />
          </motion.div>
          <motion.img whileHover={{ scale: 1.1 }} src="https://i.pravatar.cc/150?u=annette" alt="Profile" className="w-10 h-10 rounded-full border-2 border-white object-cover cursor-pointer" />
        </div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-white text-[28px] font-bold mb-6 tracking-wide relative z-10"
        >
          Hey, Annette!
        </motion.h1>
        
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
          }}
          className="flex justify-between gap-3 relative z-10"
        >
          {[
            { icon: Phone, label: 'Call', color: 'text-emerald-500 fill-emerald-500' },
            { icon: Building2, label: 'Clinic', color: 'text-purple-500' },
            { icon: Pill, label: 'Pills', color: 'text-amber-500' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
              }}
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm cursor-pointer"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner">
                <item.icon size={22} className={item.color} />
              </div>
              <span className="text-white text-xs font-medium tracking-wide">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Body Section */}
      <div className="flex-1 bg-[#F8FAFC] -mt-10 rounded-t-[40px] z-10 px-6 pt-8 pb-28 overflow-y-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg font-bold text-slate-800 mb-4 tracking-wide"
        >
          Upcoming Visits
        </motion.h2>
        
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.6 } }
          }}
          className="flex flex-col gap-4"
        >
          {/* Card 1 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, x: -20, scale: 0.95 },
              show: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            whileHover={{ scale: 1.02, y: -2, boxShadow: "0 20px 40px rgb(0,0,0,0.08)" }}
            className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                <Calendar size={14} className="text-slate-400" />
                9 Oct, 12:30 am
              </div>
              <span className="bg-purple-100 text-purple-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">On-site</span>
            </div>
            <div className="flex items-center gap-4">
              <img src="https://i.pravatar.cc/150?u=jenny" alt="Doctor" className="w-12 h-12 rounded-2xl object-cover bg-slate-100" />
              <div>
                <h3 className="font-bold text-slate-800 text-[15px]">Jenny Wilson, MD</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                  <span className="flex items-center text-amber-400"><Star size={12} className="fill-amber-400 mr-1" /> 5.0</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>Dentist</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, x: -20, scale: 0.95 },
              show: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            whileHover={{ scale: 1.02, y: -2, boxShadow: "0 20px 40px rgb(0,0,0,0.08)" }}
            className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                <Calendar size={14} className="text-slate-400" />
                10 Oct, 10:30 am
              </div>
              <span className="bg-emerald-100 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Online</span>
            </div>
            <div className="flex items-center gap-4">
              <img src="https://i.pravatar.cc/150?u=kevin" alt="Doctor" className="w-12 h-12 rounded-2xl object-cover bg-slate-100" />
              <div>
                <h3 className="font-bold text-slate-800 text-[15px]">Kevin Bernard, MD</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                  <span className="flex items-center text-amber-400"><Star size={12} className="fill-amber-400 mr-1" /> 4.8</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>Cardiologist</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Nav */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 bg-white h-[88px] rounded-b-[32px] flex items-center justify-between px-8 shadow-[0_-10px_40px_rgb(0,0,0,0.05)] z-20"
      >
        <motion.div whileHover={{ scale: 1.2, color: '#37A47C' }} whileTap={{ scale: 0.9 }} className="cursor-pointer"><Home size={24} className="text-[#37A47C]" /></motion.div>
        <motion.div whileHover={{ scale: 1.2, color: '#37A47C' }} whileTap={{ scale: 0.9 }} className="cursor-pointer"><Users size={24} className="text-slate-300 hover:text-[#37A47C] transition-colors" /></motion.div>
        <div className="relative -top-6">
          <motion.div 
            whileHover={{ scale: 1.1, y: -5, boxShadow: "0 20px 25px -5px rgba(55, 164, 124, 0.5)" }} 
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-[#37A47C] rounded-full flex items-center justify-center shadow-lg shadow-[#37A47C]/40 text-white cursor-pointer"
          >
            <Heart size={24} className="fill-white" />
          </motion.div>
        </div>
        <motion.div whileHover={{ scale: 1.2, color: '#37A47C' }} whileTap={{ scale: 0.9 }} className="cursor-pointer"><Search size={24} className="text-slate-300 hover:text-[#37A47C] transition-colors" /></motion.div>
        <motion.div whileHover={{ scale: 1.2, color: '#37A47C' }} whileTap={{ scale: 0.9 }} className="cursor-pointer"><Settings size={24} className="text-slate-300 hover:text-[#37A47C] transition-colors" /></motion.div>
      </motion.div>
    </motion.div>
  );
}
