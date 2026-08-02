import {apiClient, endpoints} from '../api';

export const accountingExpensesService = {
  async listExpenses(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingExpenses.listExpenses, {params});
    return data;
  },
  async createExpenses(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.accountingExpenses.createExpenses, body);
    return data;
  },
  async getExpensesById(expense: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingExpenses.getExpensesById(expense), {params});
    return data;
  },
  async updateExpensesById(expense: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.accountingExpenses.updateExpensesById(expense), body);
    return data;
  },
  async deleteExpensesById(expense: string | number) {
    const {data} = await apiClient.delete(endpoints.accountingExpenses.deleteExpensesById(expense));
    return data;
  },
  async uploadReceipt(expense: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.accountingExpenses.uploadReceipt(expense), body);
    return data;
  },
  async approveExpensesById(expense: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.accountingExpenses.approveExpensesById(expense), body);
    return data;
  },
};
