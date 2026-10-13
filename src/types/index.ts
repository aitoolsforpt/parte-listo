export interface Photo {
  id: string;
  src: string;
  caption: string;
  before: boolean;
  timestamp: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export type IncidentType = 'damage' | 'existing' | 'issue';
export type IncidentSeverity = 'low' | 'medium' | 'high';

export interface Incident {
  id: string;
  text: string;
  type: IncidentType;
  severity: IncidentSeverity;
  location?: string;
  photos?: string[];
  timestamp: string;
}

export interface WorkSheet {
  id: string;
  client: string;
  address: string;
  date: string;
  phone?: string;
  email?: string;
  tasks: Task[];
  photos: Photo[];
  incidents: Incident[];
  notes?: string;
  signature?: string;
  createdAt: string;
  updatedAt: string;
}