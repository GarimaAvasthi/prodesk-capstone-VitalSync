"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus, X, Users } from "lucide-react";
import { useFirestoreCRUD, FirestoreEntity } from "@/lib/hooks/useFirestoreCRUD";
import { SkeletonCard } from "./Skeleton";

export interface StaffRecord extends FirestoreEntity {
  name: string;
  role: string;
  department: string;
}

export default function StaffCRUD() {
  const {
    data: staff,
    loading,
    isModalOpen,
    editingId,
    saveRecord,
    deleteRecord,
    openForm,
    closeForm,
  } = useFirestoreCRUD<StaffRecord>({ collectionName: "staff" });

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenForm = (person?: StaffRecord) => {
    if (person) {
      setFormData({ name: person.name, role: person.role, department: person.department });
      openForm(person.id);
    } else {
      setFormData({ name: "", role: "", department: "" });
      openForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveRecord(formData, {
      loading: editingId ? "Updating staff record…" : "Onboarding staff member…",
      success: editingId ? "✅ Staff record updated." : "✅ Staff member onboarded successfully.",
    });
  };

  return (
    <div className="section-shell rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Directory</span>
          <h3 className="mt-3 text-xl font-semibold text-[var(--foreground)] sm:text-2xl">Staff Roster</h3>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="app-button app-button-primary !py-1.5 !px-4 !text-xs"
        >
          <Plus className="h-3 w-3" />
          <span className="hidden sm:inline">Onboard</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : staff.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] py-10 text-center">
            <Users className="mb-3 h-8 w-8 text-[var(--muted)]" />
            <p className="text-sm font-medium text-[var(--muted)]">No staff registered yet.</p>
          </div>
        ) : (
          staff.map((person) => (
            <div
              key={person.id}
              className="group flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between card-interactive"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[var(--foreground)]">{person.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[var(--muted)]">
                  <span className="font-medium text-[var(--brand)]">{person.role}</span>
                  <span>·</span>
                  <span>{person.department}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenForm(person)}
                  className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--foreground)] transition-colors"
                  aria-label="Edit staff"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteRecord(person.id, person.name, { confirm: `Remove ${person.name} from operations?` })}
                  className="rounded-full p-2 text-rose-500 hover:bg-rose-500/10 transition-colors"
                  aria-label="Delete staff"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-sm rounded-3xl bg-[var(--surface-strong)] p-6 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-5">
              <h4 className="font-semibold text-[var(--foreground)]">{editingId ? "Edit Staff" : "Onboard Staff"}</h4>
              <button
                onClick={closeForm}
                className="rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--line)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label !text-xs">Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="app-input !py-2.5 !text-sm"
                  placeholder="Dr. Sarah Lee"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label !text-xs">Role</label>
                  <input
                    required
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="app-input !py-2.5 !text-sm"
                    placeholder="Surgeon"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label !text-xs">Department</label>
                  <input
                    required
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="app-input !py-2.5 !text-sm"
                    placeholder="Cardiology"
                  />
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="app-button app-button-secondary flex-1 !py-2.5 !text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="app-button app-button-primary flex-1 !py-2.5 !text-sm"
                >
                  {editingId ? "Update File" : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
