"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { Activity, Droplet, Edit2, HeartPulse, Scale, X } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

export default function PatientHealthTracker() {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState({
    bp: "120/80",
    bloodSugar: "90",
    heartRate: "72",
    weight: "70",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...metrics });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchHealthData = () => {
      const docRef = doc(db, "users", user.uid);
      const unsub = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMetrics({
            bp: data.bp || "120/80",
            bloodSugar: data.bloodSugar || "90",
            heartRate: data.heartRate || "72",
            weight: data.weight || "70",
          });
        }
        setLoading(false);
      }, (err) => {
        console.error("Error fetching health records:", err);
        setLoading(false);
      });
      return unsub;
    };

    const unsub = fetchHealthData();
    return () => unsub();
  }, [user?.uid]);

  const handleOpenEdit = () => {
    setFormData(metrics);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    try {
      await updateDoc(doc(db, "users", user.uid), {
        bp: formData.bp,
        bloodSugar: formData.bloodSugar,
        heartRate: formData.heartRate,
        weight: formData.weight,
      });
      setMetrics(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating health records:", error);
    }
  };

  const panels = [
    { label: "Blood Pressure", value: metrics.bp, unit: "mmHg", icon: Activity, tone: "text-rose-500 bg-rose-500/10", border: "border-rose-500/20" },
    { label: "Blood Sugar", value: metrics.bloodSugar, unit: "mg/dL", icon: Droplet, tone: "text-sky-500 bg-sky-500/10", border: "border-sky-500/20" },
    { label: "Heart Rate", value: metrics.heartRate, unit: "bpm", icon: HeartPulse, tone: "text-[var(--brand)] bg-[var(--brand-soft)]", border: "border-[var(--brand)]/20" },
    { label: "Weight", value: metrics.weight, unit: "kg", icon: Scale, tone: "text-amber-500 bg-amber-500/10", border: "border-amber-500/20" },
  ];

  if (loading) return null;

  return (
    <>
      <div className="flex items-center justify-between mb-4 mt-8">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Chronic Disease & Vitals</h2>
        <button onClick={handleOpenEdit} className="app-button app-button-secondary !py-2 !px-4 !text-sm">
          <Edit2 className="h-4 w-4 mr-2" />
          Update Details
        </button>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {panels.map((panel) => (
          <article key={panel.label} className={`section-shell rounded-2xl border ${panel.border} p-4 sm:p-6 card-interactive`}>
            <div className={`inline-flex rounded-xl p-3 ${panel.tone}`}>
              <panel.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <p className="mt-3 text-xs font-medium text-[var(--muted)] sm:mt-5 sm:text-sm">{panel.label}</p>
            <p className="mt-1 text-2xl font-extrabold text-[var(--foreground)] sm:mt-2 sm:text-3xl">
              {panel.value} <span className="text-sm font-semibold text-[var(--muted)]">{panel.unit}</span>
            </p>
          </article>
        ))}
      </section>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-[var(--surface-strong)] p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-[var(--foreground)]">Update Health Vitals</h4>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--line)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]">Blood Pressure (mmHg)</span>
                  <input
                    type="text"
                    value={formData.bp}
                    onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
                    className="app-input"
                    placeholder="120/80"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]">Blood Sugar (mg/dL)</span>
                  <input
                    type="text"
                    value={formData.bloodSugar}
                    onChange={(e) => setFormData({ ...formData, bloodSugar: e.target.value })}
                    className="app-input"
                    placeholder="90"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]">Heart Rate (bpm)</span>
                  <input
                    type="text"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                    className="app-input"
                    placeholder="72"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]">Weight (kg)</span>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="app-input"
                    placeholder="70"
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[var(--line)]">
                <button type="button" onClick={() => setIsEditing(false)} className="app-button app-button-secondary !py-2">
                  Cancel
                </button>
                <button type="submit" className="app-button app-button-primary !py-2">
                  Save Records
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
