import React from 'react';
import { WorkSheet } from '@/types';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, User, CheckSquare, AlertTriangle, FileText, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkCardProps {
  workSheet: WorkSheet;
  onDelete: (id: string) => void;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES');
};

export const WorkCard: React.FC<WorkCardProps> = ({ workSheet, onDelete }) => {
  const completedTasks = workSheet.tasks.filter((t) => t.completed).length;
  const totalTasks = workSheet.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <Link to={`/works/${workSheet.id}`} className="block h-full">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-medium text-gray-900">{workSheet.client}</h3>
                <p className="text-sm text-gray-500">{workSheet.address}</p>
              </div>
            </div>
            <div className="text-sm">
              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
              {formatDate(workSheet.date)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">
                {completedTasks}/{totalTasks} tareas completadas
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {workSheet.incidents.length > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">
                  {workSheet.incidents.length} incidencias
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {workSheet.photos.length} fotos
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 text-sm"
            >
              Ver Detalle
            </Button>
          </div>
        </div>
      </Link>

      {/* Delete button (hidden by default) */}
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-red-500 hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(workSheet.id);
          }}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
