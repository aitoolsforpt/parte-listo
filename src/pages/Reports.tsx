import React, { useState } from 'react';
import { useWorkSheet } from '@/context/WorkSheetContext';
import { WorkCard } from '@/components/WorkCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, Calendar, Filter, Download, Share2 } from 'lucide-react';

const Reports: React.FC = () => {
  const { worksheets } = useWorkSheet();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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

    const matchesStatus = statusFilter === 'all' || (() => {
      const completedTasks = ws.tasks.filter((t) => t.completed).length;
      const totalTasks = ws.tasks.length;
      switch (statusFilter) {
        case 'completed':
          return completedTasks === totalTasks && totalTasks > 0;
        case 'in-progress':
          return completedTasks > 0 && completedTasks < totalTasks;
        case 'not-started':
          return totalTasks === 0 || completedTasks === 0;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesDate && matchesStatus;
  });

  const exportAll = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('reports-container');
      if (!element) return;

      const opt = {
        margin: 10,
        filename: `todos-los-informes-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error exporting reports:', error);
      alert('Error al exportar informes');
    }
  };

  const shareReports = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('reports-container');
      if (!element) return;

      const opt = {
        margin: 10,
        filename: `informe-resumen-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');

      if (navigator.share) {
        const file = new File([pdfBlob], `informe-resumen-${new Date().toISOString().split('T')[0]}.pdf`, { type: 'application/pdf' });
        await navigator.share({
          title: 'Resumen de Informes de Limpieza',
          text: 'Resumen de todos los partes de trabajo',
          files: [file]
        });
      } else {
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `informe-resumen-${new Date().toISOString().split('T')[0]}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error sharing reports:', error);
      alert('Error al compartir informes');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-primary" />
              Informes y Resúmenes
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {worksheets.length} partes de trabajo • {filteredWorksheets.length} filtrados
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={shareReports}>
              <Share2 className="w-4 h-4 mr-1" />
              Compartir
            </Button>
            <Button onClick={exportAll}>
              <Download className="w-4 h-4 mr-1" />
              Exportar Todo
            </Button>
          </div>
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="in-progress">En progreso</SelectItem>
                  <SelectItem value="not-started">No iniciados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Reports Container (for export) */}
        <div id="reports-container" className="hidden">
          <div className="bg-white p-8">
            <h1 className="text-3xl font-bold text-center mb-4">Resumen de Informes</h1>
            <p className="text-center text-gray-600 mb-8">
              Generado el {new Date().toLocaleDateString('es-ES')}
            </p>

            <div className="space-y-4">
              {filteredWorksheets.map((ws) => (
                <div key={ws.id} className="border-b pb-4">
                  <h3 className="font-semibold">{ws.client}</h3>
                  <p className="text-sm text-gray-600">{ws.address}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(ws.date).toLocaleDateString('es-ES')} • {ws.tasks.filter(t => t.completed).length}/{ws.tasks.length} tareas
                  </p>
                </div>
              ))}
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
              <Button onClick={() => window.location.href = '/works/new'}>
                Crear Primer Parte
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorksheets.map((ws) => (
              <WorkCard key={ws.id} workSheet={ws} onDelete={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;