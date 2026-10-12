import React, { useState } from 'react';
import { useWorkSheet } from '@/context/WorkSheetContext';
import { useNavigate } from 'react-router-dom';
import { PhotoGallery } from '@/components/PhotoGallery';
import { TaskChecklist } from '@/components/TaskChecklist';
import { IncidentList } from '@/components/IncidentList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, User, Phone, Mail, X, CheckCircle } from 'lucide-react';

const NewWork: React.FC = () => {
  const { addWorkSheet } = useWorkSheet();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    client: '',
    address: '',
    date: new Date().toISOString().split('T')[0],
    phone: '',
    email: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const workSheet = addWorkSheet({
        client: formData.client,
        address: formData.address,
        date: formData.date,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
        photos: [],
        tasks: [],
        incidents: []
      });
      
      navigate(`/works/${workSheet.id}`);
    } catch (error) {
      console.error('Error creating work sheet:', error);
      alert('Error al crear el parte de trabajo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Nuevo Parte de Trabajo
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Completa los datos básicos para crear un nuevo parte
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="btn-outline"
          >
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {/* Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Cliente *</Label>
                <Input
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label className="text-sm text-gray-500">Dirección *</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label className="text-sm text-gray-500">Fecha *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label className="text-sm text-gray-500">Teléfono</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-sm text-gray-500">Email</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label className="text-sm text-gray-500">Observaciones</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="4"
                placeholder="Observaciones adicionales sobre el trabajo..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary"
            >
              {isSubmitting ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Crear Parte de Trabajo
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewWork;