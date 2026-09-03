import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, Check, Sparkles } from 'lucide-react';

export default function TestDriveCalendar({ selectedDate, selectedTime, onSelectDate, onSelectTime }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const timeSlots = [
    '09:00 AM', '10:30 AM', '12:00 PM', 
    '02:00 PM', '03:30 PM', '05:00 PM'
  ];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isPast = (day) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDateString = (day) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  return (
    <div className="space-y-6 text-left">
      {/* Calendar Wrapper */}
      <div className="relative p-[1px] rounded-3xl bg-gradient-to-b from-blue-500/20 via-zinc-800/40 to-transparent shadow-2xl">
        <div className="bg-[#0b0b0e]/90 backdrop-blur-2xl p-6 sm:p-7 rounded-[23px] space-y-6">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-wide uppercase">
                  {monthNames[month]} <span className="text-blue-500">{year}</span>
                </h3>
                <p className="text-[11px] text-zinc-500 font-medium">Select an available appointment date</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-zinc-800">
              <button
                type="button"
                onClick={prevMonth}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-11" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDateString(day);
              const selected = selectedDate === dateStr;
              const past = isPast(day);

              return (
                <button
                  key={day}
                  type="button"
                  disabled={past}
                  onClick={() => onSelectDate(dateStr)}
                  className={`h-11 rounded-2xl text-xs font-bold transition-all relative group flex flex-col items-center justify-center ${
                    selected
                      ? 'bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-500/35 scale-105 border border-blue-400/50'
                      : past
                      ? 'text-zinc-700 cursor-not-allowed opacity-30 bg-transparent'
                      : 'text-zinc-300 hover:text-white bg-black/50 hover:bg-zinc-800/80 border border-zinc-800/60'
                  }`}
                >
                  <span>{day}</span>
                  {isToday(day) && (
                    <span className={`w-1 h-1 rounded-full mt-0.5 ${selected ? 'bg-white' : 'bg-blue-400'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time Slot Picker */}
      {selectedDate && (
        <div className="relative p-[1px] rounded-3xl bg-gradient-to-b from-emerald-500/20 via-zinc-800/40 to-transparent shadow-xl">
          <div className="bg-[#0b0b0e]/90 backdrop-blur-2xl p-6 rounded-[23px] space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Select Time Slot</h4>
                  <p className="text-[10px] text-zinc-500">Pick a convenient hour for your drive</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {selectedDate}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {timeSlots.map((slot) => {
                const active = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onSelectTime(slot)}
                    className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-between border transition-all ${
                      active
                        ? 'bg-gradient-to-r from-emerald-600/30 to-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/15 scale-[1.02]'
                        : 'bg-black/60 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <span>{slot}</span>
                    {active ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}