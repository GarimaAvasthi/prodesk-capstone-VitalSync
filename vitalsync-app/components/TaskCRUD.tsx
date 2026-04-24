"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Edit2, Trash2, Plus, X, CheckCircle2, Circle, Clock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export interface TaskRecord {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done";
  dueDate: string;
  patientId?: string;
  createdAt?: any;
}

const statusConfig = {
  "To Do":      { color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",  icon: Circle },
  "In Progress":{ color: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",          icon: Clock },
  "Done":       { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", icon: CheckCircle2 },
};

export default function TaskCRUD() {
  const { user } = useAuthStore();
  const [tasks, setTasks]           = useState<TaskRecord[]>([]);
  const [loading, setLoading]       = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [formData, setFormData]     = useState({ title: "", status: "To Do" as TaskRecord["status"], dueDate: "" });

  // ── Real-time listener filtered to this user ──────────────────────────────
  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }

    const q = query(
      collection(db, "tasks"),
      where("patientId", "==", user.uid)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: TaskRecord[] = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as TaskRecord))
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
        setTasks(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user?.uid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openForm = (task?: TaskRecord) => {
    if (task) {
      setFormData({ title: task.title, status: task.status, dueDate: task.dueDate });
      setEditingId(task.id);
    } else {
      setFormData({ title: "", status: "To Do", dueDate: "" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, "tasks", editingId), { ...formData });
      } else {
        await addDoc(collection(db, "tasks"), {
          ...formData,
          patientId: user?.uid,
          createdAt: serverTimestamp(),
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving task:", err);
      alert("Failed to save task. Check your database permissions.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteDoc(doc(db, "tasks", id));
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete task.");
      }
    }
  };

  return (
    <div className="section-shell rounded-3xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Coming up</span>
          <h3 className="mt-3 text-2xl font-semibold text-(--foreground)">Personal Tasks</h3>
          <p className="mt-1 text-sm text-(--muted)">{tasks.length} item{tasks.length !== 1 ? "s" : ""} tracked</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-1.5 rounded-full bg-(--brand) px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-(--brand)/90 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" /> Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-(--line)" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--line) bg-(--surface-strong) py-10 text-center">
            <CheckCircle2 className="mb-3 h-8 w-8 text-(--muted)" />
            <p className="text-sm font-medium text-(--muted)">No tasks yet — add one to get started.</p>
          </div>
        ) : (
          tasks.map((task) => {
            const cfg = statusConfig[task.status] ?? statusConfig["To Do"];
            const Icon = cfg.icon;
            return (
              <article
                key={task.id}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-(--line) bg-(--surface-strong) px-5 py-4 transition-all card-interactive"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-(--muted)" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-(--foreground)">{task.title}</p>
                    <p className="mt-0.5 text-xs text-(--muted)">{task.dueDate}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cfg.color}`}>
                    {task.status}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => openForm(task)}
                      aria-label="Edit task"
                      className="rounded-full p-1.5 text-(--muted) hover:bg-(--line) hover:text-(--foreground) transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      aria-label="Delete task"
                      className="rounded-full p-1.5 text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-(--surface-strong) p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-(--foreground)">
                {editingId ? "Edit Task" : "New Task"}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-(--muted) hover:bg-(--line) transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-(--muted)">Task detail</label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Blood pressure review"
                  className="w-full rounded-xl border border-(--line) bg-transparent px-3 py-2.5 text-sm text-(--foreground) outline-none focus:border-(--brand)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-(--muted)">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-(--line) bg-(--surface-strong) px-3 py-2.5 text-sm text-(--foreground) outline-none focus:border-(--brand)"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-(--muted)">Due date</label>
                  <input
                    required
                    type="text"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    placeholder="e.g. Tomorrow"
                    className="w-full rounded-xl border border-(--line) bg-transparent px-3 py-2.5 text-sm text-(--foreground) outline-none focus:border-(--brand)"
                  />
                </div>
              </div>

              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full border border-(--line) py-2.5 text-sm font-semibold text-(--muted) transition-colors hover:text-(--foreground)"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-(--brand) py-2.5 text-sm font-semibold text-white transition-all hover:bg-(--brand)/90 active:scale-95"
                >
                  {editingId ? "Save Changes" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
