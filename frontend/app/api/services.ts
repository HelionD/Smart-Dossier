import { apiClient } from './client';
import type {
  AuthTokens, LoginRequest, RegisterRequest,
  Dosja, DashboardStats, Dokument, FazaLog,
  AdvancePhaseRequest, CreateDosjaRequest, ExtractedFields,
} from '../types';

// ─── Auth ──────────────────────────────────────────────────────────────────
export const auth = {
  login: (body: LoginRequest) =>
    apiClient.post<AuthTokens>('/auth/login', body).then(r => r.data),
  register: (body: RegisterRequest) =>
    apiClient.post<AuthTokens>('/auth/register', body).then(r => r.data),
};

// ─── Cases ─────────────────────────────────────────────────────────────────
export const dosjet = {
  list: (phase?: number) =>
    apiClient.get<Dosja[]>('/dosjet', { params: phase ? { phase } : {} }).then(r => r.data),
  mine: () =>
    apiClient.get<Dosja[]>('/dosjet/mine').then(r => r.data),
  get: (id: string) =>
    apiClient.get<Dosja>(`/dosjet/${id}`).then(r => r.data),
  create: (body: CreateDosjaRequest) =>
    apiClient.post<Dosja>('/dosjet', body).then(r => r.data),
  update: (id: string, body: Partial<CreateDosjaRequest>) =>
    apiClient.patch<Dosja>(`/dosjet/${id}`, body).then(r => r.data),
  advancePhase: (id: string, body: AdvancePhaseRequest) =>
    apiClient.patch<Dosja>(`/dosjet/${id}/phase`, body).then(r => r.data),
  stats: () =>
    apiClient.get<DashboardStats>('/dosjet/stats').then(r => r.data),
  phaseHistory: (id: string) =>
    apiClient.get<FazaLog[]>(`/dosjet/${id}/history`).then(r => r.data),
};

// ─── Documents ─────────────────────────────────────────────────────────────
export const dokumentet = {
  upload: (dosjaId: string, file: { uri: string; name: string; type: string }) => {
    const form = new FormData();
    form.append('file', { uri: file.uri, name: file.name, type: file.type } as unknown as Blob);
    return apiClient.post<Dokument>(`/dosjet/${dosjaId}/dokument`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
  list: (dosjaId: string) =>
    apiClient.get<Dokument[]>(`/dosjet/${dosjaId}/dokument`).then(r => r.data),
  extract: (dokumentId: string) =>
    apiClient.post<ExtractedFields>(`/dokumentet/${dokumentId}/extract`).then(r => r.data),
  confirmExtraction: (dosjaId: string, fields: Partial<ExtractedFields>) =>
    apiClient.patch(`/dosjet/${dosjaId}`, fields).then(r => r.data),
};

// ─── AI ────────────────────────────────────────────────────────────────────
export const ai = {
  summary: (dosjaId: string) =>
    apiClient.post<{ summary: string }>(`/dosjet/${dosjaId}/ai-summary`).then(r => r.data.summary),
  generateShkrese: (dosjaId: string) =>
    apiClient.post<{ letter: string }>(`/dosjet/${dosjaId}/generate-shkrese`).then(r => r.data.letter),
};
