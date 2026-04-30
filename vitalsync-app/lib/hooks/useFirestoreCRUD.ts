"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
  where,
  onSnapshot,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export interface FirestoreEntity {
  id: string;
  createdBy?: string;
  createdAt?: any;
  [key: string]: any;
}

interface UseFirestoreCRUDOptions {
  collectionName: string;
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  filterField?: string; // Field to filter by current user UID
}

export function useFirestoreCRUD<T extends FirestoreEntity>(options: UseFirestoreCRUDOptions) {
  const { user } = useAuthStore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { collectionName, orderByField = "createdAt", orderDirection = "desc", filterField = "createdBy" } = options;

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const constraints: QueryConstraint[] = [];
    
    if (filterField) {
      constraints.push(where(filterField, "==", user.uid));
    }
    
    if (orderByField) {
      constraints.push(orderBy(orderByField, orderDirection));
    }

    const q = query(collection(db, collectionName), ...constraints);

    const unsub = onSnapshot(
      q,
      (snap) => {
        const records: T[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
        setData(records);
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setLoading(false);
        toast.error(`Failed to load ${collectionName}. Check your connection.`);
      }
    );

    return () => unsub();
  }, [user?.uid, collectionName, orderByField, orderDirection, filterField]);

  const saveRecord = async (formData: any, customToastMessages?: { loading?: string; success?: string; error?: string }) => {
    const toastId = toast.loading(customToastMessages?.loading || (editingId ? "Updating record…" : "Creating record…"));
    try {
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), { ...formData });
        toast.success(customToastMessages?.success || "✅ Record updated successfully.", { id: toastId });
      } else {
        await addDoc(collection(db, collectionName), {
          ...formData,
          [filterField || "createdBy"]: user?.uid,
          createdAt: serverTimestamp(),
        });
        toast.success(customToastMessages?.success || "✅ Record created successfully.", { id: toastId });
      }
      setIsModalOpen(false);
      return true;
    } catch (error) {
      console.error(`Error saving ${collectionName}:`, error);
      toast.error(customToastMessages?.error || "❌ Failed to save record.", { id: toastId });
      return false;
    }
  };

  const deleteRecord = async (id: string, displayName: string, customToastMessages?: { confirm?: string; loading?: string; success?: string; error?: string }) => {
    toast(customToastMessages?.confirm || `Remove ${displayName}?`, {
      action: {
        label: "Delete",
        onClick: async () => {
          const delToastId = toast.loading(customToastMessages?.loading || "Deleting record…");
          try {
            await deleteDoc(doc(db, collectionName, id));
            toast.success(customToastMessages?.success || "🗑️ Record deleted.", { id: delToastId });
          } catch (error) {
            console.error(`Error deleting ${collectionName}:`, error);
            toast.error(customToastMessages?.error || "❌ Failed to delete record.", { id: delToastId });
          }
        },
      },
    });
  };

  const openForm = (initialData: any, recordId: string | null = null) => {
    setEditingId(recordId);
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  return {
    data,
    loading,
    isModalOpen,
    editingId,
    saveRecord,
    deleteRecord,
    openForm,
    closeForm,
    user,
  };
}
