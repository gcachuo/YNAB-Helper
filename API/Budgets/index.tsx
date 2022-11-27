import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "../ApiResponse";
import moment from "moment";

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

export interface IMonth {
  to_be_budgeted: number;
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

  static async Months() {
    const month = `current`;
    const uri = `budgets/${this.budgetId}/months/${month}`;
    const response = (await axios.get(uri)) as AxiosResponse<
      ApiResponse<{ month: IMonth }>
    >;
    return response.data.data.month;
  }

  static async Transactions(transaction:{
    accountId: string;
    amount: number;
    categoryId: string;
    payeeId: string;
  }) {
    const uri = `budgets/${this.budgetId}/transactions`;
    const response = (await axios.post(uri, {
      transaction: {
        date: moment().format('YYYY-MM-DD'),
        account_id: transaction.accountId,
        amount:transaction.amount,
        category_id: transaction.categoryId,
        payee_id: transaction.payeeId,
        memo: "App",
        approved: true
      }
    })) as AxiosResponse<
      ApiResponse<{
        transaction_ids: string[];
        transaction: { id: string };
      }>
    >;
    console.log(response.data.data.transaction);
  }
}
