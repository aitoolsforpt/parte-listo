import React, { useState } from 'react';
import { WorkSheet } from '@/types';
import { Download, Share2, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignaturePad } from '@/components/SignaturePad';
import { useWorkSheet } from '@/context/WorkSheetContext';
import { loadCompany, whatsappNumber } from '@/lib/company';

interface ReportViewProps {
  workSheet: WorkSheet;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

export const ReportView: React.FC<ReportViewProps> = ({ workSheet, onClose }) => {
  const { updateWorkSheet } = useWorkSheet();
  const [generating, setGenerating] = useState(false);
  const company = loadCompany();
  const fileName = `parte-${workSheet.client.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w-]+/g, '_')}-${workSheet.date}.pdf`;

  const buildPdf = async (): Promise<Blob | null> => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('report-content');
    if (!element) return null;
    const opt = {
      margin: 10,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.92 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], avoid: ['.avoid-break'] }
    };
    return html2pdf().set(opt).from(element).outputPdf('blob');
  };

  const download = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const blob = await buildPdf();
      if (blob) download(blob);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF. Inténtalo de nuevo.');
    } finally {
      setGenerating(false);
    }
  };

  const message = `Hola ${workSheet.client}, te envío el parte de trabajo del ${formatDate(workSheet.date)}${company.name ? ` (${company.name})` : ''}.`;

  const shareReport = async (viaWhatsApp = false) => {
    setGenerating(true);
    try {
      const blob = await buildPdf();
      if (!blob) return;
      const file = new File([blob], fileName, { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: `Parte de trabajo - ${workSheet.client}`, text: message, files: [file] });
      } else {
        // Ordenador: se descarga el PDF y se abre WhatsApp para adjuntarlo a mano
        download(blob);
        if (viaWhatsApp) {
          const number = whatsappNumber(workSheet.phone);
          window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
        }
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing PDF:', error);
        alert('Error al compartir. Inténtalo de nuevo.');
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Vista previa del informe</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => shareReport(true)} disabled={generating}>
              <MessageCircle className="w-4 h-4 mr-1" />
              WhatsApp
            </Button>
            <Button variant="outline" size="sm" onClick={() => shareReport(false)} disabled={generating}>
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
        <div className="flex-1 overflow-y-auto p-6">
          <div id="report-content" className="max-w-2xl mx-auto bg-white">
            {/* Header */}
            <div className="text-center mb-8 pb-6 border-b">
              {company.name && <p className="text-lg font-semibold text-gray-800">{company.name}</p>}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Parte de Trabajo</h1>
              {company.phone && <p className="text-gray-600">Tel. {company.phone}</p>}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Tareas</h3>
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
                      <span className={task.completed ? 'text-gray-800' : 'text-gray-500'}>
                        {task.text}{!task.completed && ' (pendiente)'}
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
                    <div key={photo.id} className="avoid-break space-y-1">
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
                    <li key={incident.id} className="avoid-break flex items-start space-x-2 p-2 bg-red-50 rounded">
                      <span className="text-red-500">⚠</span>
                      <span className="text-gray-800">
                        <strong>
                          {incident.type === 'existing' ? 'Daño previo' : incident.type === 'damage' ? 'Daño causado' : 'Incidencia'}:
                        </strong>{' '}
                        {incident.text}
                      </span>
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

            {/* Signature */}
            <div className="avoid-break mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Conforme del cliente</h3>
              {workSheet.signature ? (
                <div>
                  <img src={workSheet.signature} alt="Firma del cliente" className="h-24 border-b border-gray-400" />
                  <p className="text-xs text-gray-500 mt-1">{workSheet.client} · {formatDate(workSheet.date)}</p>
                </div>
              ) : (
                <div data-html2canvas-ignore="true" className="space-y-2">
                  <p className="text-sm text-gray-500">El cliente firma aquí con el dedo para dar su conformidad:</p>
                  <SignaturePad onSave={(signature) => updateWorkSheet(workSheet.id, { signature })} />
                </div>
              )}
              {workSheet.signature && (
                <button
                  data-html2canvas-ignore="true"
                  className="text-xs text-gray-400 underline mt-1"
                  onClick={() => updateWorkSheet(workSheet.id, { signature: undefined })}
                >
                  Repetir firma
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="pt-6 border-t text-center text-sm text-gray-500">
              <p>Generado con Parte Listo</p>
              <p className="mt-1">{formatDate(new Date().toISOString())}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
