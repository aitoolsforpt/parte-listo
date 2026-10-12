import React, { useState } from 'react';
import { WorkSheet } from '@/types';
import { Download, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportViewProps {
  workSheet: WorkSheet;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

export const ReportView: React.FC<ReportViewProps> = ({ workSheet, onClose }) => {
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('report-content');
      if (!element) return;

      const opt = {
        margin: 10,
        filename: `parte-${workSheet.client}-${workSheet.date}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Inténtalo de nuevo.');
    } finally {
      setGenerating(false);
    }
  };

  const shareReport = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('report-content');
      if (!element) return;

      const opt = {
        margin: 10,
        filename: `parte-${workSheet.client}-${workSheet.date}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');

      if (navigator.share) {
        const file = new File([pdfBlob], `parte-${workSheet.client}-${workSheet.date}.pdf`, { type: 'application/pdf' });
        await navigator.share({
          title: `Parte de trabajo - ${workSheet.client}`,
          text: `Informe de limpieza para ${workSheet.client}`,
          files: [file]
        });
      } else {
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `parte-${workSheet.client}-${workSheet.date}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      alert('Error al compartir. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Vista previa del informe</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={shareReport} disabled={generating}>
              <Share2 className="w-4 h-4 mr-1" />
              Compartir
            </Button>
            <Button variant="outline" size="sm" onClick={generatePDF} disabled={generating}>
              <Download className="w-4 h-4 mr-1" />
              {generating ? 'Generando...' : 'Descargar PDF'}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Report Content */}
        <div id="report-content" className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 pb-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Parte de Trabajo</h1>
              <p className="text-gray-600">Limpieza de fin de obra y mantenimiento</p>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium">{workSheet.client}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-medium">{formatDate(workSheet.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dirección</p>
                <p className="font-medium">{workSheet.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">{workSheet.phone || '-'}</p>
              </div>
            </div>

            {/* Tasks */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Tareas Realizadas</h3>
              {workSheet.tasks.length === 0 ? (
                <p className="text-gray-500">No hay tareas registradas</p>
              ) : (
                <ul className="space-y-2">
                  {workSheet.tasks.map((task) => (
                    <li key={task.id} className="flex items-center space-x-2">
                      <span className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        task.completed ? 'border-green-500 text-green-500' : 'border-gray-300'
                      }`}>
                        {task.completed && <span className="text-xs">✓</span>}
                      </span>
                      <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                        {task.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Photos */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Fotografías</h3>
              {workSheet.photos.length === 0 ? (
                <p className="text-gray-500">No hay fotografías</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {workSheet.photos.map((photo) => (
                    <div key={photo.id} className="space-y-1">
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        className="w-full h-32 object-cover rounded"
                      />
                      <p className="text-xs text-gray-600 text-center">
                        {photo.before ? 'Antes' : 'Después'} - {photo.caption || 'Sin descripción'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Incidents */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Incidencias / Daños Preexistentes</h3>
              {workSheet.incidents.length === 0 ? (
                <p className="text-gray-500">No hay incidencias registradas</p>
              ) : (
                <ul className="space-y-2">
                  {workSheet.incidents.map((incident) => (
                    <li key={incident.id} className="flex items-start space-x-2 p-2 bg-red-50 rounded">
                      <span className="text-red-500">⚠</span>
                      <span className="text-gray-800">{incident.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Notes */}
            {workSheet.notes && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Observaciones</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{workSheet.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-6 border-t text-center text-sm text-gray-500">
              <p>Documento generado automáticamente por CleanReport</p>
              <p className="mt-1">{formatDate(new Date().toISOString())}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
