"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus, X, Users } from "lucide-react";
import { useFirestoreCRUD, FirestoreEntity } from "@/lib/hooks/useFirestoreCRUD";
import { SkeletonRow } from "./Skeleton";

export interface PatientRecord extends FirestoreEntity {
  name: string;
  visitReason: string;
  time: string;
  room: string;
}

export default function PatientCRUD() {
  const {
    data: patients,
    loading,
    isModalOpen,
    editingId,
    saveRecord,
    deleteRecord,
    openForm,
    closeForm,
  } = useFirestoreCRUD<PatientRecord>({ collectionName: "patients" });

  const [formData, setFormData] = useState({
    name: "",
    visitReason: "",
    time: "",
    room: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenForm = (patient?: PatientRecord) => {
    if (patient) {
      setFormData({ name: patient.name, visitReason: patient.visitReason, time: patient.time, room: patient.room });
      openForm(patient.id);
    } else {
      setFormData({ name: "", visitReason: "", time: "", room: "" });
      openForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveRecord(formData, {
      loading: editingId ? "Updating record…" : "Adding patient…",
      success: editingId ? "✅ Patient record updated successfully." : "✅ Patient added to schedule.",
    });
  };

  return (
    <div className="section-shell rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Patient Directory</span>
          <h3 className="mt-3 text-xl font-semibold text-[var(--foreground)] sm:text-2xl">Real-time schedule</h3>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="app-button app-button-primary !py-2 !px-4 !text-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Patient</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] py-10 text-center">
            <Users className="mb-3 h-8 w-8 text-[var(--muted)]" />
            <p className="text-sm font-medium text-[var(--muted)]">No patients scheduled. Add one to see it here.</p>
          </div>
        ) : (
          patients.map((patient) => (
            <div
              key={patient.id}
              className="group flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between card-interactive"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[var(--foreground)]">{patient.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-[var(--muted)]">
                  <span className="rounded bg-[var(--line)] px-1.5 py-0.5 text-xs font-medium">{patient.time}</span>
                  <span className="text-xs">·</span>
                  <span className="text-xs">{patient.visitReason}</span>
                  <span className="text-xs">·</span>
                  <span className="text-xs">{patient.room}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                <button
                  onClick={() => handleOpenForm(patient)}
                  className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--foreground)] transition-colors"
                  aria-label="Edit patient"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteRecord(patient.id, patient.name, { confirm: `Remove ${patient.name} from schedule?` })}
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-[var(--surface-strong)] p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-[var(--foreground)]">
                {editingId ? "Edit Patient Record" : "New Patient Record"}
              </h4>
              <button
                onClick={closeForm}
                className="rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Patient Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Jane Doe"
                  className="app-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Reason for Visit</label>
                <input
                  required
                  type="text"
                  name="visitReason"
                  value={formData.visitReason}
                  onChange={handleInputChange}
                  placeholder="e.g. Cardiology consult"
                  className="app-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    required
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="app-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Room / Location</label>
                  <input
                    required
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    placeholder="e.g. Room 4"
                    className="app-input"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="app-button app-button-secondary !py-2 !px-5 !text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="app-button app-button-primary !py-2 !px-6 !text-sm"
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
