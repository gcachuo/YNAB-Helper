import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "../ApiResponse";

export interface IAccounts {
  id: string;
  name: string;
  balance: number;
  on_budget: boolean;
  type: string;
}

export default class BudgetsAPI {
  static async Accounts(budgetId: string) {
    const uri = `budgets/${budgetId}/accounts`;

    const response = (await axios.get(uri)) as AxiosResponse<
      ApiResponse<{ accounts: IAccounts[] }>
    >;

    // console.log(response.data.data.accounts);

    return response.data.data.accounts;
  }
}
