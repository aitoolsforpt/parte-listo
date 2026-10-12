import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkSheet } from '@/context/WorkSheetContext';
import { PhotoGallery } from '@/components/PhotoGallery';
import { TaskChecklist } from '@/components/TaskChecklist';
import { IncidentList } from '@/components/IncidentList';
import { ReportView } from '@/components/ReportView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, User, Phone, Mail, FileText, Edit2, Save, X } from 'lucide-react';

const WorkDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getWorkSheet, updateWorkSheet } = useWorkSheet();
  const navigate = useNavigate();

  const workSheet = getWorkSheet(id || '');

  const [isEditing, setIsEditing] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const [editData, setEditData] = useState({
    client: workSheet?.client || '',
    address: workSheet?.address || '',
    date: workSheet?.date || '',
    phone: workSheet?.phone || '',
    email: workSheet?.email || '',
    notes: workSheet?.notes || ''
  });

  if (!workSheet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Parte de trabajo no encontrado</h2>
          <p className="text-gray-500 mt-2">El parte de trabajo que buscas no existe</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateWorkSheet(workSheet.id, {
      ...workSheet,
      client: editData.client,
      address: editData.address,
      date: editData.date,
      phone: editData.phone,
      email: editData.email,
      notes: editData.notes
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      client: workSheet.client,
      address: workSheet.address,
      date: workSheet.date,
      phone: workSheet.phone || '',
      email: workSheet.email || '',
      notes: workSheet.notes || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Photo handlers
  const handleAddPhoto = (photo: Partial<Photo>) => {
    const newPhoto: Photo = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      src: photo.src || '',
      caption: photo.caption || '',
      before: photo.before || false,
      timestamp: new Date().toISOString()
    };
    updateWorkSheet(workSheet.id, {
      photos: [...workSheet.photos, newPhoto]
    });
  };

  const handleRemovePhoto = (id: string) => {
    updateWorkSheet(workSheet.id, {
      photos: workSheet.photos.filter(p => p.id !== id)
    });
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    updateWorkSheet(workSheet.id, {
      photos: workSheet.photos.map(p =>
        p.id === id ? { ...p, caption } : p
      )
    });
  };

  // Task handlers
  const handleAddTask = (text: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      completed: false
    };
    updateWorkSheet(workSheet.id, {
      tasks: [...workSheet.tasks, newTask]
    });
  };

  const handleRemoveTask = (id: string) => {
    updateWorkSheet(workSheet.id, {
      tasks: workSheet.tasks.filter(t => t.id !== id)
    });
  };

  const handleToggleTask = (id: string) => {
    updateWorkSheet(workSheet.id, {
      tasks: workSheet.tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    });
  };

  const handleUpdateTask = (id: string, text: string) => {
    updateWorkSheet(workSheet.id, {
      tasks: workSheet.tasks.map(t =>
        t.id === id ? { ...t, text } : t
      )
    });
  };

  // Incident handlers
  const handleAddIncident = (text: string, type: Incident['type'], severity: Incident['severity']) => {
    const newIncident: Incident = {
      id: `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      type,
      severity,
      timestamp: new Date().toISOString()
    };
    updateWorkSheet(workSheet.id, {
      incidents: [...workSheet.incidents, newIncident]
    });
  };

  const handleRemoveIncident = (id: string) => {
    updateWorkSheet(workSheet.id, {
      incidents: workSheet.incidents.filter(i => i.id !== id)
    });
  };

  const handleUpdateIncident = (id: string, updates: Partial<Incident>) => {
    updateWorkSheet(workSheet.id, {
      incidents: workSheet.incidents.map(i =>
        i.id === id ? { ...i, ...updates } : i
      )
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              {isEditing ? (
                <Input
                  value={editData.client}
                  onChange={(e) => setEditData({ ...editData, client: e.target.value })}
                  className="max-w-xs"
                />
              ) : (
                workSheet.client
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(workSheet.date)}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowReport(true)}
              className="btn-outline"
            >
              Ver Informe
            </Button>
            {isEditing ? (
              <Button onClick={handleSave} className="btn-primary">
                <Save className="w-4 h-4 mr-1" />
                Guardar
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-1" />
                Editar
              </Button>
            )}
          </div>
        </div>

        {/* Basic Info (Editable) */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Información del Trabajo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-500">Dirección</Label>
              {isEditing ? (
                <Input
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                />
              ) : (
                <p className="font-medium flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {workSheet.address}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm text-gray-500">Fecha</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                />
              ) : (
                <p className="font-medium">{formatDate(workSheet.date)}</p>
              )}
            </div>
            <div>
              <Label className="text-sm text-gray-500">Teléfono</Label>
              {isEditing ? (
                <Input
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                />
              ) : (
                <p className="font-medium flex items-center">
                  <Phone className="w-4 h-4 mr-1 text-gray-400" />
                  {workSheet.phone || '-'}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm text-gray-500">Email</Label>
              {isEditing ? (
                <Input
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              ) : (
                <p className="font-medium flex items-center">
                  <Mail className="w-4 h-4 mr-1 text-gray-400" />
                  {workSheet.email || '-'}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <PhotoGallery
            photos={workSheet.photos}
            onAddPhoto={handleAddPhoto}
            onRemovePhoto={handleRemovePhoto}
            onUpdateCaption={handleUpdateCaption}
          />

          <TaskChecklist
            tasks={workSheet.tasks}
            onAddTask={handleAddTask}
            onRemoveTask={handleRemoveTask}
            onToggleTask={handleToggleTask}
            onUpdateTask={handleUpdateTask}
          />

          <IncidentList
            incidents={workSheet.incidents}
            onAddIncident={handleAddIncident}
            onRemoveIncident={handleRemoveIncident}
            onUpdateIncident={handleUpdateIncident}
          />
        </div>

        {/* Notes */}
        {workSheet.notes && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Observaciones</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{workSheet.notes}</p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReport && (
        <ReportView workSheet={workSheet} onClose={() => setShowReport(false)} />
      )}
    </div>
  );
};

export default WorkDetails;