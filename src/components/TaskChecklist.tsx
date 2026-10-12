import React, { useState } from 'react';
import { Task } from '@/types';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TaskChecklistProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onRemoveTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, text: string) => void;
}

export const TaskChecklist: React.FC<TaskChecklistProps> = ({
  tasks,
  onAddTask,
  onRemoveTask,
  onToggleTask,
  onUpdateTask
}) => {
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAdd = () => {
    if (newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask('');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const handleSaveEdit = (id: string) => {
    if (editingText.trim()) {
      onUpdateTask(id, editingText.trim());
    }
    setEditingId(null);
    setEditingText('');
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <CheckSquare className="w-5 h-5 mr-2 text-primary" />
          Checklist de Tareas
        </h2>
        <span className="text-sm text-gray-500">
          {completedCount} / {tasks.length} completadas
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Add task */}
      <div className="flex space-x-2 mb-4">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Añadir nueva tarea..."
        />
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No hay tareas registradas</p>
          <p className="text-sm text-gray-400 mt-1">Añade las tareas a realizar</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center space-x-2 group">
              <button
                onClick={() => onToggleTask(task.id)}
                className="flex-shrink-0"
              >
                {task.completed ? (
                  <CheckSquare className="w-5 h-5 text-green-500" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {editingId === task.id ? (
                <>
                  <Input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(task.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                  />
                  <Button size="sm" onClick={() => handleSaveEdit(task.id)}>
                    Guardar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <span
                    onDoubleClick={() => handleEdit(task)}
                    className={`flex-1 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {task.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemoveTask(task.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};