"use client";
/* eslint-disable react-hooks/preserve-manual-memoization */

/**
 * Custom hook for Firestore CRUD operations
 * Handles real-time data synchronization with error handling and logging
 */

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { logger } from "@/lib/logger";
import { handleFirestoreError } from "@/lib/errors";

export interface FirestoreEntity {
  id: string;
  createdBy?: string;
  createdAt?: any;
  updatedAt?: any;
  [key: string]: any;
}

interface UseFirestoreCRUDOptions {
  collectionName: string;
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  filterField?: string;
  onError?: (error: Error) => void;
}

interface UseFirestoreCRUDReturn<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  isModalOpen: boolean;
  editingId: string | null;
  saveRecord: (formData: any, customToastMessages?: ToastMessages) => Promise<boolean>;
  deleteRecord: (id: string, displayName: string, customToastMessages?: ToastMessages) => void;
  openForm: (recordId?: string | null) => void;
  closeForm: () => void;
  user: any;
}

interface ToastMessages {
  loading?: string;
  success?: string;
  error?: string;
  confirm?: string;
}

/**
 * Custom hook for managing Firestore CRUD operations
 * @param options Configuration options for the hook
 * @returns Object with data, methods, and state for CRUD operations
 */
export function useFirestoreCRUD<T extends FirestoreEntity>(
  options: UseFirestoreCRUDOptions
): UseFirestoreCRUDReturn<T> {
  const { user } = useAuthStore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    collectionName,
    orderByField = "createdAt",
    orderDirection = "desc",
    filterField = "createdBy",
    onError,
  } = options;

  const moduleLogger = useMemo(() => 
    logger.createModuleLogger(`useFirestoreCRUD[${collectionName}]`),
    [collectionName]
  );

  /**
   * Fetch data from Firestore with real-time updates
   */
  useEffect(() => {
    if (!user?.uid) {
      moduleLogger.debug("No user UID, skipping data fetch");
      Promise.resolve().then(() => setLoading(false));
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

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const records: T[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as T));
          
          Promise.resolve().then(() => {
            setData(records);
            setError(null);
            setLoading(false);
          });
          
          moduleLogger.debug(`Loaded ${records.length} records from ${collectionName}`);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          Promise.resolve().then(() => {
            setError(error);
            setLoading(false);
          });
          moduleLogger.error(`Error processing snapshot data: ${error.message}`, error);
        }
      },
      (err) => {
        const firestoreError = handleFirestoreError(err);
        moduleLogger.error(`Error fetching ${collectionName}: ${firestoreError.message}`, firestoreError);
        
        Promise.resolve().then(() => {
          setError(firestoreError);
          setLoading(false);
        });
        
        toast.error(`Failed to load ${collectionName}. Check your connection.`);
        onError?.(firestoreError);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, collectionName, orderByField, orderDirection, filterField, onError, moduleLogger]);

  /**
   * Save a record (create or update)
   */
  const saveRecord = useCallback(
    async (
      formData: any,
      customToastMessages?: ToastMessages
    ): Promise<boolean> => {
      const isUpdating = !!editingId;
      const toastId = toast.loading(
        customToastMessages?.loading || (isUpdating ? "Updating record…" : "Creating record…")
      );

      try {
        if (isUpdating) {
          await updateDoc(doc(db, collectionName, editingId!), {
            ...formData,
            updatedAt: serverTimestamp(),
          });
          moduleLogger.info(`Successfully updated record ${editingId}`);
          toast.success(
            customToastMessages?.success || "✅ Record updated successfully.",
            { id: toastId, duration: 2000 }
          );
        } else {
          const docRef = await addDoc(collection(db, collectionName), {
            ...formData,
            [filterField || "createdBy"]: user?.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          moduleLogger.info(`Successfully created new record ${docRef.id}`);
          toast.success(
            customToastMessages?.success || "✅ Record created successfully.",
            { id: toastId, duration: 2000 }
          );
        }
        setIsModalOpen(false);
        setEditingId(null);
        return true;
      } catch (err) {
        const firestoreError = handleFirestoreError(err);
        moduleLogger.error(
          `Error saving ${collectionName}: ${firestoreError.message}`,
          firestoreError
        );
        toast.error(
          customToastMessages?.error || "❌ Failed to save record.",
          { id: toastId, duration: 3000 }
        );
        return false;
      }
    },
    [editingId, collectionName, filterField, user?.uid, moduleLogger]
  );

  /**
   * Delete a record with confirmation
   */
  const deleteRecord = useCallback(
    (id: string, displayName: string, customToastMessages?: ToastMessages): void => {
      toast(customToastMessages?.confirm || `Remove ${displayName}?`, {
        duration: 5000,
        action: {
          label: "Delete",
          onClick: async () => {
            const delToastId = toast.loading(
              customToastMessages?.loading || "Deleting record…"
            );
            try {
              await deleteDoc(doc(db, collectionName, id));
              moduleLogger.info(`Successfully deleted record ${id}`);
              toast.success(
                customToastMessages?.success || "🗑️ Record deleted.",
                { id: delToastId, duration: 2000 }
              );
            } catch (err) {
              const firestoreError = handleFirestoreError(err);
              moduleLogger.error(
                `Error deleting ${collectionName}: ${firestoreError.message}`,
                firestoreError
              );
              toast.error(
                customToastMessages?.error || "❌ Failed to delete record.",
                { id: delToastId, duration: 3000 }
              );
            }
          },
        },
      });
    },
    [collectionName, moduleLogger]
  );

  /**
   * Open form for creating or editing
   */
  const openForm = useCallback((recordId?: string | null): void => {
    setEditingId(recordId || null);
    setIsModalOpen(true);
    moduleLogger.debug(`Opened form for ${recordId ? "editing" : "creating"}`);
  }, [moduleLogger]);

  /**
   * Close form
   */
  const closeForm = useCallback((): void => {
    setIsModalOpen(false);
    setEditingId(null);
    moduleLogger.debug("Closed form");
  }, [moduleLogger]);

  return {
    data,
    loading,
    error,
    isModalOpen,
    editingId,
    saveRecord,
    deleteRecord,
    openForm,
    closeForm,
    user,
  };
}
