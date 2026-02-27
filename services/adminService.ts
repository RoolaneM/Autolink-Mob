import { api } from './api';

/* ================================
   TYPES (ajusta se necessário)
================================ */

export interface AdminUser {
  id: number;
  identidadeVerificada: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Documento {
  id: number;
  tipo: string;
  url: string;
  createdAt: string;
}

/* ================================
   USERS
================================ */

// Listar usuários pendentes
export async function getPendingUsers(): Promise<AdminUser[]> {
  const { data } = await api.get('/admin/users/pending');
  return data;
}

// Verificar usuário
export async function verifyUser(userId: number) {
  const { data } = await api.patch(`/admin/users/${userId}/verify`);
  return data;
}

// Buscar documentos do usuário
export async function getUserDocuments(userId: number): Promise<Documento[]> {
  const { data } = await api.get(`/admin/users/${userId}/documents`);
  return data;
}

/* ================================
   STANDS
================================ */

// Listar stands pendentes
export async function getPendingStands(): Promise<AdminUser[]> {
  const { data } = await api.get('/admin/stands/pending');
  return data;
}

// Verificar stand
export async function verifyStand(userId: number) {
  const { data } = await api.patch(`/admin/stands/${userId}/verify`);
  return data;
}

/* ================================
   VENDEDORES INFORMAIS
================================ */

// Listar vendedores pendentes
export async function getPendingVendedores(): Promise<AdminUser[]> {
  const { data } = await api.get('/admin/vendedores/pending');
  return data;
}

// Verificar vendedor
export async function verifyVendedor(userId: number) {
  const { data } = await api.patch(`/admin/vendedores/${userId}/verify`);
  return data;
}