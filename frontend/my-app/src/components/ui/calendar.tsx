'use client'

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import clsx from "clsx"

interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date) => void
  className?: string
}

export const Calendar: React.FC<CalendarProps> = ({ selected, onSelect, className }) => {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayIndex = currentMonth.getDay()
  const prevMonthDays = Array.from(
    { length: firstDayIndex },
    (_, i) => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i - firstDayIndex + 1)
  )
  const currentMonthDays = Array.from(
    { length: daysInMonth },
    (_, i) => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
  )
  const totalCells = [...prevMonthDays, ...currentMonthDays]
  const weeks = Array.from({ length: Math.ceil(totalCells.length / 7) }, (_, i) =>
    totalCells.slice(i * 7, (i + 1) * 7)
  )

  const handlePrevMonth = () =>
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  const handleNextMonth = () =>
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))

  const isSelected = (date: Date) =>
    selected &&
    date.getDate() === selected.getDate() &&
    date.getMonth() === selected.getMonth() &&
    date.getFullYear() === selected.getFullYear()

  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  return (
    <div className={clsx("p-4 bg-white gap-2 rounded-lg shadow", className)}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth}>
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
        </h2>
        <button onClick={handleNextMonth}>
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-gray-600 font-medium">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div key={day} className="p-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="contents">
            {week.map((date, dayIndex) => (
              <div
                key={dayIndex}
                onClick={() => onSelect && onSelect(date)}
                className={clsx(
                  "p-2 cursor-pointer text-sm rounded-md",
                  isToday(date) && "bg-pink-100 text-pink-700",
                  isSelected(date) && "bg-purple-200 text-purple-800",
                  date.getMonth() !== currentMonth.getMonth() && "text-gray-400",
                  "hover:bg-purple-100"
                )}
              >
                {date.getDate()}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
