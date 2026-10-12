import React, { useState } from 'react';
import { Incident } from '@/types';
import { AlertTriangle, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IncidentListProps {
  incidents: Incident[];
  onAddIncident: (text: string, type: Incident['type'], severity: Incident['severity']) => void;
  onRemoveIncident: (id: string) => void;
  onUpdateIncident: (id: string, updates: Partial<Incident>) => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  onAddIncident,
  onRemoveIncident,
  onUpdateIncident
}) => {
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [type, setType] = useState<Incident['type']>('damage');
  const [severity, setSeverity] = useState<Incident['severity']>('low');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      onAddIncident(text.trim(), type, severity);
      setShowForm(false);
      setText('');
      setLocation('');
      setNotes('');
      setSeverity('low');
    }
  };

  const getTypeLabel = (t: Incident['type']) => {
    switch (t) {
      case 'damage':
        return 'Daño';
      case 'existing':
        return 'Preexistente';
      case 'issue':
        return 'Incidencia';
      default:
        return t;
    }
  };

  const getSeverityColor = (s: Incident['severity']) => {
    switch (s) {
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityLabel = (s: Incident['severity']) => {
    switch (s) {
      case 'low':
        return 'Baja';
      case 'medium':
        return 'Media';
      case 'high':
        return 'Alta';
      default:
        return s;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
          Incidencias / Daños Preexistentes
        </h2>
        <span className="text-sm text-red-500 font-medium">
          {incidents.length} registradas
        </span>
      </div>

      {/* Add incident button */}
      <div className="mb-4">
        {!showForm ? (
          <Button variant="outline" onClick={() => setShowForm(true)} className="w-full border-dashed">
            <Plus className="w-4 h-4 mr-2" />
            Registrar incidencia o daño
          </Button>
        ) : (
          <div className="space-y-3 border border-red-200 rounded-lg p-4 bg-red-50">
            <div>
              <Select value={type} onValueChange={(v) => setType(v as Incident['type'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="damage">Daño</SelectItem>
                  <SelectItem value="existing">Preexistente</SelectItem>
                  <SelectItem value="issue">Incidencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Ubicación</p>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej: Salón, Cocina..."
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Gravedad</p>
                <Select value={severity} onValueChange={(v) => setSeverity(v as Incident['severity'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Gravedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Descripción</p>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe lo sucedido..."
                className="min-h-[80px]"
              />
            </div>

            {location && (
              <p className="text-xs text-gray-600">
                <span className="font-medium">Ubicación:</span> {location}
              </p>
            )}

            <div className="flex space-x-2">
              <Button onClick={handleAdd} size="sm" className="flex-1">
                Registrar
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} size="sm">
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Incident list */}
      {incidents.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No hay incidencias registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className={`border-l-4 p-4 rounded ${getSeverityColor(incident.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/70">
                        {getTypeLabel(incident.type)}
                      </span>
                      <span className="text-xs font-medium">
                        {getSeverityLabel(incident.severity)}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">{incident.text}</p>
                    {incident.location && (
                      <p className="text-sm text-gray-600 mt-1">📍 {incident.location}</p>
                    )}
                    {incident.photos && incident.photos.length > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        📷 {incident.photos.length} foto(s)
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={() => onRemoveIncident(incident.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};