import {apiClient, endpoints} from '../api';

export const jobsworkshopService = {
  async listJobs(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.jobsworkshop.listJobs, {params});
    return data;
  },
  async createJobs(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.jobsworkshop.createJobs, body);
    return data;
  },
  async getJobsById(job: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.jobsworkshop.getJobsById(job), {params});
    return data;
  },
  async updateJobsById(job: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.jobsworkshop.updateJobsById(job), body);
    return data;
  },
  async deleteJobsById(job: string | number) {
    const {data} = await apiClient.delete(endpoints.jobsworkshop.deleteJobsById(job));
    return data;
  },
};
