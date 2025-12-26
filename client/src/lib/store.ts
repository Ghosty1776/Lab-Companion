import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DeviceType = 'server' | 'desktop' | 'laptop' | 'router' | 'switch' | 'iot' | 'other';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  os: string;
  ip: string;
  mac: string;
  location: string;
  tags: string[];
  status: 'online' | 'offline' | 'maintenance';
  lastSeen?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string; // Markdown
  deviceId?: string; // Optional link to device
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  category: string;
}

export type ScriptType = 'bash' | 'python' | 'powershell' | 'javascript' | 'other';

export interface Script {
  id: string;
  name: string;
  language: ScriptType;
  description: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  linkedDeviceIds?: string[];
  linkedChecklistIds?: string[];
}

export interface User {
  username: string;
  token: string;
}

interface AppState {
  user: User | null;
  devices: Device[];
  notes: Note[];
  checklists: Checklist[];
  scripts: Script[];
  
  login: (username: string) => void;
  logout: () => void;
  
  addDevice: (device: Omit<Device, 'id'>) => void;
  updateDevice: (id: string, device: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  addChecklist: (checklist: Omit<Checklist, 'id'>) => void;
  updateChecklist: (id: string, checklist: Partial<Checklist>) => void;
  deleteChecklist: (id: string) => void;

  addScript: (script: Omit<Script, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateScript: (id: string, script: Partial<Script>) => void;
  deleteScript: (id: string) => void;
  
  importData: (data: string) => boolean;
  exportData: () => string;
}

// Initial Mock Data
const initialDevices: Device[] = [
  { id: '1', name: 'pve-01', type: 'server', os: 'Proxmox VE 8.1', ip: '192.168.1.10', mac: '00:11:32:XX:XX:XX', location: 'Rack U2', tags: ['virtualization', 'prod'], status: 'online', lastSeen: new Date().toISOString() },
  { id: '2', name: 'opnsense-gw', type: 'router', os: 'OPNsense 24.1', ip: '192.168.1.1', mac: '00:00:5E:XX:XX:XX', location: 'Rack U1', tags: ['gateway', 'firewall'], status: 'online', lastSeen: new Date().toISOString() },
  { id: '3', name: 'kali-vm', type: 'desktop', os: 'Kali Linux', ip: '192.168.1.105', mac: 'AA:BB:CC:DD:EE:FF', location: 'Virtual', tags: ['pentest', 'lab'], status: 'offline', lastSeen: new Date(Date.now() - 86400000).toISOString() },
];

const initialNotes: Note[] = [
  { id: '1', title: 'Network Segmentation Plan', content: '# VLANs\n- 10: Mgmt\n- 20: Servers\n- 30: IoT\n- 40: Guest\n\nNeed to configure firewall rules for inter-vlan routing.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['network', 'planning'] },
];

const initialChecklists: Checklist[] = [
  {
    id: '1',
    title: 'New Server Provisioning',
    description: 'Steps to take when setting up a new Linux box',
    category: 'Setup',
    tasks: [
      { id: 't1', text: 'Update packages (apt update && apt upgrade)', completed: false },
      { id: 't2', text: 'Create non-root user with sudo', completed: false },
      { id: 't3', text: 'Configure SSH (keys only, no root login)', completed: false },
      { id: 't4', text: 'Install Fail2Ban', completed: false },
      { id: 't5', text: 'Configure UFW', completed: false },
    ]
  }
];

const initialScripts: Script[] = [
  {
    id: '1',
    name: 'Update & Upgrade',
    language: 'bash',
    description: 'Standard update command for Debian/Ubuntu systems',
    content: '#!/bin/bash\n\nsudo apt update && sudo apt upgrade -y\nsudo apt autoremove -y',
    tags: ['maintenance', 'linux'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      devices: initialDevices,
      notes: initialNotes,
      checklists: initialChecklists,
      scripts: initialScripts,

      login: (username) => set({ user: { username, token: 'mock-token' } }),
      logout: () => set({ user: null }),

      addDevice: (device) => set((state) => ({
        devices: [...state.devices, { ...device, id: Math.random().toString(36).substring(7) }]
      })),
      updateDevice: (id, updated) => set((state) => ({
        devices: state.devices.map(d => d.id === id ? { ...d, ...updated } : d)
      })),
      deleteDevice: (id) => set((state) => ({
        devices: state.devices.filter(d => d.id !== id)
      })),

      addNote: (note) => set((state) => ({
        notes: [...state.notes, { 
          ...note, 
          id: Math.random().toString(36).substring(7),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]
      })),
      updateNote: (id, updated) => set((state) => ({
        notes: state.notes.map(n => n.id === id ? { ...n, ...updated, updatedAt: new Date().toISOString() } : n)
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id)
      })),

      addChecklist: (checklist) => set((state) => ({
        checklists: [...state.checklists, { ...checklist, id: Math.random().toString(36).substring(7) }]
      })),
      updateChecklist: (id, updated) => set((state) => ({
        checklists: state.checklists.map(c => c.id === id ? { ...c, ...updated } : c)
      })),
      deleteChecklist: (id) => set((state) => ({
        checklists: state.checklists.filter(c => c.id !== id)
      })),

      addScript: (script) => set((state) => ({
        scripts: [...state.scripts, { 
          ...script, 
          id: Math.random().toString(36).substring(7),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]
      })),
      updateScript: (id, updated) => set((state) => ({
        scripts: state.scripts.map(s => s.id === id ? { ...s, ...updated, updatedAt: new Date().toISOString() } : s)
      })),
      deleteScript: (id) => set((state) => ({
        scripts: state.scripts.filter(s => s.id !== id)
      })),

      exportData: () => {
        const { devices, notes, checklists, scripts } = get();
        return JSON.stringify({ devices, notes, checklists, scripts });
      },
      importData: (jsonStr) => {
        try {
          const data = JSON.parse(jsonStr);
          if (data.devices && data.notes && data.checklists) {
            set({ 
              devices: data.devices, 
              notes: data.notes, 
              checklists: data.checklists,
              scripts: data.scripts || [] // Handle backward compatibility
            });
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      }
    }),
    {
      name: 'homelab-storage',
    }
  )
);