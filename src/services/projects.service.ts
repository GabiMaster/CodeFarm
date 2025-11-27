import { apiService } from './api.service';
import { ENDPOINTS } from '../config/api.config';

interface CreateProjectData {
  name: string;
  description?: string;
  language: string;
  ownerId: string;
}

interface UpdateProjectData {
  name?: string;
  description?: string;
  language?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export const projectsService = {
  async create(data: CreateProjectData): Promise<Project> {
    const response = await apiService.post<Project>(
      ENDPOINTS.PROJECTS.CREATE,
      data
    );
    return response.payload;
  },

  async getByUser(userId: string): Promise<Project[]> {
    const response = await apiService.get<Project[]>(
      ENDPOINTS.PROJECTS.GET_BY_USER(userId)
    );
    return response.payload;
  },

  async getById(projectId: string): Promise<Project> {
    const response = await apiService.get<Project>(
      ENDPOINTS.PROJECTS.GET_BY_ID(projectId)
    );
    return response.payload;
  },

  async update(projectId: string, data: UpdateProjectData): Promise<Project> {
    const response = await apiService.put<Project>(
      ENDPOINTS.PROJECTS.UPDATE(projectId),
      data
    );
    return response.payload;
  },

  async delete(projectId: string): Promise<void> {
    await apiService.delete(ENDPOINTS.PROJECTS.DELETE(projectId));
  },
};