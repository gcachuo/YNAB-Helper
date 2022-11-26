import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "../ApiResponse";

export interface IAccounts {
  id: string;
  name: string;
  balance: number;
  on_budget: boolean;
  type: string;
  deleted: boolean;
  closed: boolean;
}

export interface ICategory {
  deleted: boolean;
  hidden: boolean;
  id: string;
  name: string;
  categories: {
    budgeted: number;
    activity: number;
    balance: number;
    id: string;
    name: string;
  }[];
}

export default class BudgetsAPI {
  static budgetId = "last-used";

  static async Accounts() {
    const uri = `budgets/${this.budgetId}/accounts`;

    const response = (await axios.get(uri)) as AxiosResponse<
      ApiResponse<{ accounts: IAccounts[] }>
    >;

    // console.log(response.data.data.accounts);

    return response.data.data.accounts;
  }

  static async Categories() {
    const uri = `budgets/${this.budgetId}/categories`;
    const response = (await axios.get(uri)) as AxiosResponse<
      ApiResponse<{ category_groups: ICategory[] }>
    >;

    // console.log(response.data.data.category_groups);
    // console.log(response.data.data.category_groups[0].categories);

    return response.data.data.category_groups;
  }
}
