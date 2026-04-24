"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Edit2, Trash2, Plus, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export interface PatientRecord {
  id: string;
  name: string;
  visitReason: string;
  time: string;
  room: string;
  createdBy?: string;
  createdAt?: any;
}

export default function PatientCRUD() {
  const { user } = useAuthStore();
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    visitReason: "",
    time: "",
    room: "",
  });

  // ── Real-time listener filtered to this user ──────────────────────────────
  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }

    const q = query(
      collection(db, "patients"),
      where("createdBy", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: PatientRecord[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PatientRecord));
        setPatients(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching patients:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user?.uid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openForm = (patient?: PatientRecord) => {
    if (patient) {
      setFormData({
        name: patient.name,
        visitReason: patient.visitReason,
        time: patient.time,
        room: patient.room,
      });
      setEditingId(patient.id);
    } else {
      setFormData({ name: "", visitReason: "", time: "", room: "" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing
        const docRef = doc(db, "patients", editingId);
        await updateDoc(docRef, { ...formData });
      } else {
        // Create new
        await addDoc(collection(db, "patients"), {
          ...formData,
          createdBy: user?.uid,
          createdAt: serverTimestamp(),
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Failed to save patient. Please check your permissions and try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      try {
        await deleteDoc(doc(db, "patients", id));
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Failed to delete patient.");
      }
    }
  };

  return (
    <div className="section-shell rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Patient Directory</span>
          <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Real-time schedule</h3>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--brand)]/90"
        >
          <Plus className="h-4 w-4" />
          Add Patient
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-[var(--muted)]">Loading patients from database...</p>
        ) : patients.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No patients scheduled. Add one to see it here.</p>
        ) : (
          patients.map((patient) => (
            <div
              key={patient.id}
              className="group flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-[color:var(--surface-strong)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between card-interactive"
            >
              <div>
                <p className="font-semibold text-[var(--foreground)]">{patient.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                  <span className="rounded bg-[var(--line)] px-1.5 py-0.5 text-xs">{patient.time}</span>
                  <span>•</span>
                  <span>{patient.visitReason}</span>
                  <span>•</span>
                  <span>{patient.room}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                <button
                  onClick={() => openForm(patient)}
                  className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--foreground)] transition-colors"
                  aria-label="Edit patient"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(patient.id)}
                  className="rounded-full p-2 text-rose-500 hover:bg-rose-500/10 transition-colors"
                  aria-label="Delete patient"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[var(--surface-strong)] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-[var(--foreground)]">
                {editingId ? "Edit Patient Record" : "New Patient Record"}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--muted)]">Patient Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-xl border-1.5 border-[var(--line)] bg-transparent px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--brand)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--muted)]">Reason for Visit</label>
                <input
                  required
                  type="text"
                  name="visitReason"
                  value={formData.visitReason}
                  onChange={handleInputChange}
                  placeholder="e.g. Cardiology consult"
                  className="w-full rounded-xl border-1.5 border-[var(--line)] bg-transparent px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--brand)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--muted)]">Time</label>
                  <input
                    required
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-1.5 border-[var(--line)] bg-transparent px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--brand)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--muted)]">Room / Location</label>
                  <input
                    required
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    placeholder="e.g. Room 4"
                    className="w-full rounded-xl border-1.5 border-[var(--line)] bg-transparent px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--brand)]"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[var(--brand)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--brand)]/90 active:scale-95"
                >
                  {editingId ? "Save Changes" : "Create Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
