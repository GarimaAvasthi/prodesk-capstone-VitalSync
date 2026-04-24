"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Edit2, Trash2, Plus, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export interface StaffRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  createdBy?: string;
  createdAt?: any;
}

export default function StaffCRUD() {
  const { user } = useAuthStore();
  const [staff, setStaff] = useState<StaffRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
  });

  // ── Real-time listener filtered to this user ──────────────────────────────
  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }

    const q = query(
      collection(db, "staff"),
      where("createdBy", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: StaffRecord[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as StaffRecord));
        setStaff(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching staff:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user?.uid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openForm = (person?: StaffRecord) => {
    if (person) {
      setFormData({ name: person.name, role: person.role, department: person.department });
      setEditingId(person.id);
    } else {
      setFormData({ name: "", role: "", department: "" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, "staff", editingId), { ...formData });
      } else {
        await addDoc(collection(db, "staff"), {
          ...formData,
          createdBy: user?.uid,
          createdAt: serverTimestamp(),
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving staff:", error);
      alert("Failed to save staff.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Remove this staff member from operations?")) {
      try {
        await deleteDoc(doc(db, "staff", id));
      } catch (error) {
        console.error("Error deleting staff:", error);
        alert("Failed to delete staff.");
      }
    }
  };

  return (
    <div className="section-shell rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Directory</span>
          <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Staff Roster</h3>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[var(--brand)]/90"
        >
          <Plus className="h-3 w-3" /> Onboard
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-[var(--muted)]">Loading staff directory...</p>
        ) : staff.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No staff registered yet.</p>
        ) : (
          staff.map((person) => (
            <div key={person.id} className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-[var(--line)] bg-[color:var(--surface-strong)] px-5 py-4 card-interactive gap-3">
              <div>
                <p className="font-semibold text-[var(--foreground)]">{person.name}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span className="font-medium text-[var(--brand)]">{person.role}</span>
                  <span>•</span>
                  <span>{person.department}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button onClick={() => openForm(person)} className="p-2 text-[var(--muted)] hover:bg-[var(--line)] rounded-full"><Edit2 className="h-3 w-3" /></button>
                <button onClick={() => handleDelete(person.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-full"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[var(--surface-strong)] p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h4 className="font-semibold">{editingId ? "Edit Staff" : "Onboard Staff"}</h4>
              <button onClick={() => setIsModalOpen(false)}><X className="h-4 w-4 text-[var(--muted)]" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--muted)]">Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm" placeholder="Dr. Sarah Lee" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--muted)]">Role</label>
                  <input required type="text" name="role" value={formData.role} onChange={handleInputChange} className="mt-1 w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm" placeholder="Surgeon" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--muted)]">Department</label>
                  <input required type="text" name="department" value={formData.department} onChange={handleInputChange} className="mt-1 w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2 text-sm" placeholder="Cardiology" />
                </div>
              </div>
              <button type="submit" className="w-full rounded-full bg-[var(--brand)] py-2 text-sm font-semibold text-white mt-4">{editingId ? "Update File" : "Register"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
