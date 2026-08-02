import {apiClient, endpoints} from '../api';

export const accountingExpenseCategoriesService = {
  async listExpenseCategories(params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingExpenseCategories.listExpenseCategories, {params});
    return data;
  },
  async createExpenseCategories(body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.post(endpoints.accountingExpenseCategories.createExpenseCategories, body);
    return data;
  },
  async getExpenseCategoriesById(expenseCategory: string | number, params?: Record<string, unknown>) {
    const {data} = await apiClient.get(endpoints.accountingExpenseCategories.getExpenseCategoriesById(expenseCategory), {params});
    return data;
  },
  async updateExpenseCategoriesById(expenseCategory: string | number, body?: Record<string, unknown> | FormData) {
    const {data} = await apiClient.put(endpoints.accountingExpenseCategories.updateExpenseCategoriesById(expenseCategory), body);
    return data;
  },
  async deleteExpenseCategoriesById(expenseCategory: string | number) {
    const {data} = await apiClient.delete(endpoints.accountingExpenseCategories.deleteExpenseCategoriesById(expenseCategory));
    return data;
  },
};
