import { ArrowLeft, Star, Heart, Calendar, Wifi, Battery, Signal } from 'lucide-react';
import { motion } from 'motion/react';

export default function AppointmentScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="w-[350px] h-[750px] bg-[#F8FAFC] rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative border-[8px] border-white/80 shrink-0"
    >
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 z-50 text-slate-800 bg-[#F8FAFC]">
        <span className="text-[13px] font-semibold tracking-wide">9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal size={14} className="fill-slate-800" />
          <Wifi size={14} />
          <Battery size={16} className="fill-slate-800" />
        </div>
      </div>

      {/* Header */}
      <div className="pt-16 px-6 pb-4 flex items-center justify-between bg-[#F8FAFC] z-10 relative">
        <motion.div whileHover={{ scale: 1.1, x: -2 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-slate-400 cursor-pointer">
          <ArrowLeft size={20} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg font-bold text-slate-800 tracking-wide"
        >
          Appointment
        </motion.h1>
        <div className="w-10 h-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-28 relative z-10">
        {/* Doctor Info */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="flex flex-col items-center mt-4 mb-8"
        >
          <motion.div whileHover={{ scale: 1.05, rotate: -2 }} className="w-24 h-24 rounded-[28px] overflow-hidden mb-4 bg-[#37A47C]/10 p-1.5 shadow-sm cursor-pointer">
            <img src="https://i.pravatar.cc/150?u=kevin" alt="Doctor" className="w-full h-full object-cover rounded-[22px]" />
          </motion.div>
          <h2 className="text-[22px] font-bold text-slate-800 mb-1 tracking-wide">Kevin Bernard, MD</h2>
          <div className="flex items-center text-slate-500 text-sm font-medium">
            <Heart size={14} className="text-red-500 fill-red-500 mr-1.5" /> Cardiologist
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="bg-white rounded-[24px] p-5 flex justify-between items-center mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="text-center flex-1 border-r border-slate-100">
            <div className="text-[11px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">Top Rating</div>
            <div className="font-bold text-slate-800 flex items-center justify-center gap-1 text-lg">
              <Star size={16} className="text-amber-400 fill-amber-400" /> 4.8
            </div>
          </div>
          <div className="text-center flex-1 border-r border-slate-100">
            <div className="text-[11px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">Patients</div>
            <div className="font-bold text-slate-800 text-lg">+1000</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-[11px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">Exp. years</div>
            <div className="font-bold text-slate-800 text-lg">+10</div>
          </div>
        </motion.div>

        {/* Availability */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4 tracking-wide">Availability</h3>
          <div className="flex justify-between gap-2">
            {[
              { day: 'Mon', date: '2' },
              { day: 'Tue', date: '3', active: true },
              { day: 'Wed', date: '4' },
              { day: 'Thu', date: '5' },
              { day: 'Fri', date: '6' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center w-[52px] h-[72px] rounded-2xl transition-colors cursor-pointer ${item.active ? 'bg-[#37A47C] text-white shadow-lg shadow-[#37A47C]/30' : 'bg-white text-slate-400 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-slate-50'}`}
              >
                <span className={`text-xl font-bold mb-0.5 ${item.active ? 'text-white' : 'text-slate-800'}`}>{item.date}</span>
                <span className="text-[11px] font-semibold">{item.day}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Available slots */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.7 } }
          }}
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4 tracking-wide">Available slots</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              '8:00', '08:30', '12:30', '14:00',
              '8:00', '08:30', '12:30', '14:00'
            ].map((time, i) => (
              <motion.div 
                key={i} 
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center py-3 rounded-xl text-[13px] font-bold transition-colors cursor-pointer ${i === 2 ? 'bg-[#37A47C] text-white shadow-md shadow-[#37A47C]/20' : 'bg-white text-slate-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-slate-50'}`}
              >
                {time}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Button */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
        className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] to-transparent z-20"
      >
        <motion.button 
          whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(55, 164, 124, 0.5)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#37A47C] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#37A47C]/30 flex items-center justify-center gap-2 tracking-wide"
        >
          <Calendar size={18} />
          Book Appointment
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
