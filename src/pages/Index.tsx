import React, { useState } from 'react';
import { useWorkSheet } from '@/context/WorkSheetContext';
import { WorkCard } from '@/components/WorkCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Calendar, Filter, FileText } from 'lucide-react';
import { loadCompany, saveCompany } from '@/lib/company';

const Index = () => {
  const { worksheets, deleteWorkSheet, replaceAll } = useWorkSheet();
  const [company, setCompany] = useState(loadCompany);

  const updateCompany = (field: 'name' | 'phone', value: string) => {
    const next = { ...company, [field]: value };
    setCompany(next);
    saveCompany(next);
  };

  const backup = () => {
    const blob = new Blob([JSON.stringify(worksheets)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `partes-copia-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const restore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const list = JSON.parse(await file.text());
      if (!Array.isArray(list) || list.some((w) => !w || !w.id || !w.client)) throw new Error('formato');
      if (confirm(`Esto reemplaza tus ${worksheets.length} partes actuales por ${list.length} de la copia. ¿Continuar?`)) {
        replaceAll(list);
      }
    } catch {
      alert('El archivo no es una copia válida de Parte Listo.');
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredWorksheets = worksheets.filter((ws) => {
    const matchesSearch = ws.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ws.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = dateFilter === 'all' || (() => {
      const today = new Date();
      const worksheetDate = new Date(ws.date);
      switch (dateFilter) {
        case 'today':
          return worksheetDate.toDateString() === today.toDateString();
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return worksheetDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return worksheetDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-primary" />
              Partes de Trabajo
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {worksheets.length} partes de trabajo • {filteredWorksheets.length} filtrados
            </p>
          </div>

          <Button onClick={() => window.location.href = '/works/new'} className="btn-primary">
            <Plus className="w-4 h-4 mr-1" />
            Nuevo Parte
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por cliente o dirección..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las fechas</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Worksheets List */}
        {filteredWorksheets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay partes de trabajo</h3>
            <p className="text-gray-500 mb-4">
              {worksheets.length === 0
                ? "Aún no has creado ningún parte de trabajo"
                : "No se encontraron partes de trabajo con los filtros seleccionados"
              }
            </p>
            {worksheets.length === 0 && (
              <Button onClick={() => window.location.href = '/works/new'} className="btn-primary">
                <Plus className="w-4 h-4 mr-1" />
                Crear Primer Parte
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorksheets.map((ws) => (
              <WorkCard key={ws.id} workSheet={ws} onDelete={deleteWorkSheet} />
            ))}
          </div>
        )}

        {/* Ajustes */}
        <details className="mt-8 bg-white rounded-lg shadow-sm p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            Mi empresa y copia de seguridad
          </summary>
          <div className="mt-4 space-y-4">
            <p className="text-xs text-gray-500">
              Tus partes se guardan solo en este navegador. Descarga una copia de vez en cuando.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nombre de tu empresa (sale en el informe)"
                value={company.name}
                onChange={(e) => updateCompany('name', e.target.value)}
              />
              <Input
                placeholder="Tu teléfono (sale en el informe)"
                value={company.phone}
                onChange={(e) => updateCompany('phone', e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={backup} disabled={worksheets.length === 0}>
                Descargar copia
              </Button>
              <Button asChild variant="outline" size="sm">
                <label className="cursor-pointer">
                  Restaurar copia
                  <input type="file" accept="application/json" onChange={restore} className="hidden" />
                </label>
              </Button>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default Index;