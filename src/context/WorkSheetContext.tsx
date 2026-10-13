import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WorkSheet } from '@/types';

interface WorkSheetContextType {
  worksheets: WorkSheet[];
  addWorkSheet: (workSheet: Omit<WorkSheet, 'id' | 'createdAt' | 'updatedAt'>) => WorkSheet;
  getWorkSheet: (id: string) => WorkSheet | undefined;
  updateWorkSheet: (id: string, updates: Partial<WorkSheet>) => void;
  deleteWorkSheet: (id: string) => void;
  replaceAll: (list: WorkSheet[]) => void;
}

const WorkSheetContext = createContext<WorkSheetContextType | undefined>(undefined);

const STORAGE_KEY = 'cleanreport_worksheets';

export const WorkSheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [worksheets, setWorksheets] = useState<WorkSheet[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setWorksheets(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading worksheets from localStorage:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(worksheets));
      } catch (error) {
        console.error('Error saving worksheets:', error);
        alert('No hay espacio para guardar. Descarga una copia de seguridad y borra partes antiguos.');
      }
    }
  }, [worksheets, isLoaded]);

  const addWorkSheet: WorkSheetContextType['addWorkSheet'] = (data) => {
    const workSheet: WorkSheet = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setWorksheets((prev) => [workSheet, ...prev]);
    return workSheet;
  };

  const getWorkSheet: WorkSheetContextType['getWorkSheet'] = (id) => {
    return worksheets.find((w) => w.id === id);
  };

  const updateWorkSheet: WorkSheetContextType['updateWorkSheet'] = (id, updates) => {
    setWorksheets((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, ...updates, updatedAt: new Date().toISOString() }
          : w
      )
    );
  };

  const deleteWorkSheet: WorkSheetContextType['deleteWorkSheet'] = (id) => {
    setWorksheets((prev) => prev.filter((w) => w.id !== id));
  };

  const replaceAll = (list: WorkSheet[]) => setWorksheets(list);

  return (
    <WorkSheetContext.Provider
      value={{ worksheets, addWorkSheet, getWorkSheet, updateWorkSheet, deleteWorkSheet, replaceAll }}
    >
      {children}
    </WorkSheetContext.Provider>
  );
};

export const useWorkSheet = () => {
  const context = useContext(WorkSheetContext);
  if (!context) {
    throw new Error('useWorkSheet must be used within a WorkSheetProvider');
  }
  return context;
};
