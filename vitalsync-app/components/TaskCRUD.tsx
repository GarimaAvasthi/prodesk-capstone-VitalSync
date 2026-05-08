"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus, X, CheckCircle2, Circle, Clock } from "lucide-react";
import { useFirestoreCRUD, FirestoreEntity } from "@/lib/hooks/useFirestoreCRUD";
import { SkeletonTask } from "./Skeleton";

export interface TaskRecord extends FirestoreEntity {
  title: string;
  status: "To Do" | "In Progress" | "Done";
  dueDate: string;
  patientId?: string;
}

const statusConfig = {
  "To Do":       { color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",      icon: Circle },
  "In Progress": { color: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",              icon: Clock },
  "Done":        { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", icon: CheckCircle2 },
};

export default function TaskCRUD() {
  const {
    data: tasks,
    loading,
    isModalOpen,
    editingId,
    saveRecord,
    deleteRecord,
    openForm,
    closeForm,
  } = useFirestoreCRUD<TaskRecord>({ 
    collectionName: "tasks",
    filterField: "patientId" 
  });

  const [formData, setFormData] = useState({ 
    title: "", 
    status: "To Do" as TaskRecord["status"], 
    dueDate: "" 
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenForm = (task?: TaskRecord) => {
    if (task) {
      setFormData({ title: task.title, status: task.status, dueDate: task.dueDate });
      openForm(task.id);
    } else {
      setFormData({ title: "", status: "To Do", dueDate: "" });
      openForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveRecord(formData, {
      loading: editingId ? "Updating task…" : "Adding task…",
      success: editingId ? "✅ Task updated successfully." : "✅ Task added to your list.",
    });
  };

  return (
    <div className="section-shell rounded-3xl p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Coming up</span>
          <h3 className="mt-3 text-xl font-semibold text-[var(--foreground)] sm:text-2xl">Personal Tasks</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">{tasks.length} item{tasks.length !== 1 ? "s" : ""} tracked</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="app-button app-button-primary !py-1.5 !px-4 !text-xs"
        >
          <Plus className="h-3.5 w-3.5" /> Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="mt-5 space-y-3">
        {loading ? (
          <>
            <SkeletonTask />
            <SkeletonTask />
            <SkeletonTask />
          </>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] py-10 text-center">
            <CheckCircle2 className="mb-3 h-8 w-8 text-[var(--muted)]" />
            <p className="text-sm font-medium text-[var(--muted)]">No tasks yet — add one to get started.</p>
          </div>
        ) : (
          tasks.map((task) => {
            const cfg = statusConfig[task.status] ?? statusConfig["To Do"];
            const Icon = cfg.icon;
            return (
              <article
                key={task.id}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 transition-all card-interactive"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">{task.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--muted)]">{task.dueDate}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`hidden rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-block ${cfg.color}`}>
                    {task.status}
                  </span>
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                    <button
                      onClick={() => handleOpenForm(task)}
                      aria-label="Edit task"
                      className="rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteRecord(task.id, task.title, { confirm: `Delete "${task.title}"?` })}
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-sm rounded-3xl bg-[var(--surface-strong)] p-6 shadow-2xl animate-slide-up">
            <div className="mb-5 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-[var(--foreground)]">
                {editingId ? "Edit Task" : "New Task"}
              </h4>
              <button
                onClick={closeForm}
                className="rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--line)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label !text-xs">Task detail</label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Blood pressure review"
                  className="app-input !py-2.5 !text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label !text-xs">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="app-input !py-2.5 !text-sm !appearance-none"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label !text-xs">Due date</label>
                  <input
                    required
                    type="text"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    placeholder="e.g. Tomorrow"
                    className="app-input !py-2.5 !text-sm"
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
