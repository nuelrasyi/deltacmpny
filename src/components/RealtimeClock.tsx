'use client'

import React, { useState, useEffect } from 'react'
import { CalendarDays, Clock } from 'lucide-react'

export default function RealtimeClock() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    // Set initial time
    setTime(new Date())
    
    // Update every second
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!time) {
    // Render skeleton/placeholder during SSR to avoid hydration mismatch
    return (
      <div className="hidden md:flex items-center gap-4 text-slate-500 bg-slate-100/50 py-1.5 px-4 rounded-full border border-slate-200/50 animate-pulse">
        <div className="w-32 h-4 bg-slate-200 rounded"></div>
        <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
        <div className="w-20 h-4 bg-slate-200 rounded"></div>
      </div>
    )
  }

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

  const dayName = days[time.getDay()]
  const date = time.getDate()
  const monthName = months[time.getMonth()]
  const year = time.getFullYear()

  // Pad with leading zeros
  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const seconds = time.getSeconds().toString().padStart(2, '0')

  return (
    <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600 bg-slate-50 py-1.5 px-4 rounded-full border border-slate-200 shadow-sm transition-all hover:bg-white hover:shadow-md">
      <div className="flex items-center gap-1.5">
        <CalendarDays className="w-4 h-4 text-primary-500" />
        <span>{`${dayName}, ${date} ${monthName} ${year}`}</span>
      </div>
      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
      <div className="flex items-center gap-1.5 w-[85px]">
        <Clock className="w-4 h-4 text-primary-500" />
        <span className="tabular-nums tracking-wide">
          {hours}:{minutes}<span className="text-slate-400 text-xs ml-0.5 animate-pulse">:{seconds}</span>
        </span>
      </div>
    </div>
  )
}
