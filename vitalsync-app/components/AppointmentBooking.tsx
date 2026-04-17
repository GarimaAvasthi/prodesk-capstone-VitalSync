"use client";

import { useState } from "react";

interface AppointmentFormData {
  doctor: string;
  date: string;
  time: string;
  reason: string;
  notes: string;
}

interface AppointmentBookingProps {
  onSubmit?: (appointment: AppointmentFormData) => void;
}

export default function AppointmentBooking({ onSubmit }: AppointmentBookingProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    doctor: "",
    date: "",
    time: "",
    reason: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(formData);
    }

    setSubmitted(true);

    setTimeout(() => {
      setFormData({
        doctor: "",
        date: "",
        time: "",
        reason: "",
        notes: "",
      });
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-white/5 p-8 animate-fade-in">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Book an Appointment
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Schedule a consultation with our world-class healthcare professionals in just a few clicks.
        </p>

        {submitted && (
          <div className="mb-8 p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white flex-shrink-0">
              OK
            </div>
            <p className="text-teal-800 dark:text-teal-200 font-semibold">
              Appointment request submitted successfully!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Select Specialist
              </label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
              >
                <option value="">Choose a doctor...</option>
                <option value="dr-smith">Dr. Smith - General Medicine</option>
                <option value="dr-jones">Dr. Jones - Cardiology</option>
                <option value="dr-williams">Dr. Williams - Pediatrics</option>
                <option value="dr-brown">Dr. Brown - Neurology</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Preferred Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Available Time
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
              >
                <option value="">Select time...</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Reason for Visit
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
              >
                <option value="">Select reason...</option>
                <option value="checkup">General Checkup</option>
                <option value="followup">Follow-up Visit</option>
                <option value="consultation">Consultation</option>
                <option value="vaccination">Vaccination</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tell us more about your concerns..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/20 transform hover:-translate-y-1 transition-all active:scale-95"
          >
            Confirm Appointment
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 flex-shrink-0">
            i
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-slate-200">Pro Tip:</span> Early morning slots (9 AM - 10 AM) typically have the shortest wait times.
          </p>
        </div>
      </div>
    </div>
  );
}