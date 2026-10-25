import { invoke } from '@tauri-apps/api/core';

/* ------------------------------------------------------------------ */
/* Auth                                                               */
/* ------------------------------------------------------------------ */

export interface ElybyLoginRequest {
  username: string;
  password: string;
}

export interface ElybyTokenResponse {
  token: string;
  expires_in?: number;
}

export async function loginElyby(
  payload: ElybyLoginRequest,
): Promise<ElybyTokenResponse> {
  return invoke<ElybyTokenResponse>('login_elyby', { payload });
}

export function getElybyToken(): Promise<string | null> {
  return invoke<string | null>('get_elyby_token');
}

export async function logoutElyby(): Promise<void> {
  return invoke<void>('logout_elyby');
}

/* ------------------------------------------------------------------ */
/* Instances                                                          */
/* ------------------------------------------------------------------ */

export interface InstanceSummary {
  id: string;
  name: string;
  version: string;
  path: string;
  icon?: string | null;
  last_launched?: number | null;
}

export interface CreateInstanceRequest {
  name: string;
  version: string;
  username?: string | null;
}

export interface CreateInstanceResponse {
  id: string;
  path: string;
  name: string;
}

export interface RenameInstanceRequest {
  instance_id: string;
  new_name: string;
}

export interface DeleteInstanceRequest {
  instance_id: string;
}

export interface LaunchInstanceRequest {
  instance_id: string;
}

export interface LaunchInstanceResponse {
  ok: boolean;
  message: string;
  java_command?: string | null;
}

export async function listInstances(): Promise<InstanceSummary[]> {
  return invoke<InstanceSummary[]>('list_instances');
}

export async function createInstance(
  payload: CreateInstanceRequest,
): Promise<CreateInstanceResponse> {
  return invoke<CreateInstanceResponse>('create_instance', { payload });
}

export async function renameInstance(
  payload: RenameInstanceRequest,
): Promise<InstanceSummary> {
  return invoke<InstanceSummary>('rename_instance', { payload });
}

export async function deleteInstance(
  payload: DeleteInstanceRequest,
): Promise<boolean> {
  return invoke<boolean>('delete_instance', { payload });
}

export async function launchInstance(
  payload: LaunchInstanceRequest,
): Promise<LaunchInstanceResponse> {
  return invoke<LaunchInstanceResponse>('launch_instance', { payload });
}

export async function openInstanceFolder(
  instanceId: string,
): Promise<boolean> {
  return invoke<boolean>('open_instance_folder', { instance_id: instanceId });
}

/* ------------------------------------------------------------------ */
/* Modrinth / Modpacks                                                */
/* ------------------------------------------------------------------ */

export interface ModrinthPack {
  id: string;
  title: string;
  description?: string | null;
  icon_url?: string | null;
  downloads?: number | null;
  versions: string[];
}

export interface SearchModpacksRequest {
  query: string;
  limit?: number;
}

export interface SearchModpacksResponse {
  packs: ModrinthPack[];
}

export interface InstallModpackRequest {
  pack_id: string;
  version_id?: string | null;
  instance_path: string;
}

export interface InstallModpackResponse {
  ok: boolean;
  message: string;
  files_installed: number;
}

export async function fetchModrinthPacks(
  payload: SearchModpacksRequest,
): Promise<SearchModpacksResponse> {
  return invoke<SearchModpacksResponse>('fetch_modrinth_packs', { payload });
}

export async function downloadModpack(
  payload: InstallModpackRequest,
): Promise<InstallModpackResponse> {
  return invoke<InstallModpackResponse>('download_modpack', { payload });
}
