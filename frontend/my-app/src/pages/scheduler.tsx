import React, { useState } from 'react';
import Navbar from '@/components/navbar/navbar3';
import Footer from '@/components/footer/Footer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import WeeklyGridView from '@/components/scheduler/WeeklyGridView';
import MonthlyView from '@/components/scheduler/MonthlyView';
import DailyView from '@/components/scheduler/DailyView';
import UpcomingEvents from '@/components/scheduler/UpcomingEvents';
import '@/styles/globals.css';

export default function SchedulerPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'week' | 'month' | 'day'>('week'); // Type-safe view state

  // Example appointments with date information
  const appointments = [
    { date: '2024-11-25T10:00:00', title: 'Dental Checkup', patient: 'Alice Smith', color: 'bg-blue-100' },
    { date: '2024-11-23T10:30:00', title: 'Consultation', patient: 'John Doe', color: 'bg-green-100' },
    { date: '2024-11-27T14:00:00', title: 'Therapy Session', patient: 'Mary Johnson', color: 'bg-yellow-100' },
  ];

  // Handle back and next navigation
  const handleBack = () => {
    if (view === 'month') {
      const prevMonth = new Date(date);
      prevMonth.setMonth(date.getMonth() - 1);
      setDate(prevMonth);
    } else if (view === 'week') {
      const prevWeek = new Date(date);
      prevWeek.setDate(date.getDate() - 7);
      setDate(prevWeek);
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      const nextMonth = new Date(date);
      nextMonth.setMonth(date.getMonth() + 1);
      setDate(nextMonth);
    } else if (view === 'week') {
      const nextWeek = new Date(date);
      nextWeek.setDate(date.getDate() + 7);
      setDate(nextWeek);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-200">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Appointments</h1>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <Calendar selected={date} onSelect={(date) => date && setDate(date)} className="rounded-md" />
            </div>
            <UpcomingEvents appointments={appointments} />
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={() => setDate(new Date())}>Today</Button>
                  <Button variant="outline" onClick={handleBack}>Back</Button>
                  <Button variant="outline" onClick={handleNext}>Next</Button>
                  <span className="text-sm text-gray-600">{date.toDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant={view === 'month' ? 'default' : 'outline'} onClick={() => setView('month')}>Month</Button>
                  <Button variant={view === 'week' ? 'default' : 'outline'} onClick={() => setView('week')}>Week</Button>
                  <Button variant={view === 'day' ? 'default' : 'outline'} onClick={() => setView('day')}>Day</Button>
                </div>
              </div>
              {view === 'week' && <WeeklyGridView appointments={appointments} date={date} />}
              {view === 'month' && <MonthlyView date={date} appointments={appointments} />}
              {view === 'day' && <DailyView appointments={appointments} />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
