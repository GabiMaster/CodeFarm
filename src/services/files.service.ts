import { apiService } from './api.service';
import { ENDPOINTS } from '../config/api.config';

interface CreateFileData {
  name: string;
  content: string;
  projectId: string;
  path?: string;
}

interface UpdateFileData {
  name?: string;
  content?: string;
  path?: string;
}

interface File {
  id: string;
  name: string;
  content: string;
  projectId: string;
  path: string;
  createdAt: string;
  updatedAt: string;
}

export const filesService = {
  async create(data: CreateFileData): Promise<File> {
    const response = await apiService.post<File>(
      ENDPOINTS.FILES.CREATE,
      data
    );
    return response.payload;
  },

  async getByProject(projectId: string): Promise<File[]> {
    const response = await apiService.get<File[]>(
      ENDPOINTS.FILES.GET_BY_PROJECT(projectId)
    );
    return response.payload;
  },

  async update(fileId: string, data: UpdateFileData): Promise<File> {
    const response = await apiService.put<File>(
      ENDPOINTS.FILES.UPDATE(fileId),
      data
    );
    return response.payload;
  },

  async delete(fileId: string): Promise<void> {
    await apiService.delete(ENDPOINTS.FILES.DELETE(fileId));
  },
};