import { configureStore } from "@reduxjs/toolkit";
import bankAccountsReducer from "./bankAccountsSlice";

export const store = configureStore({
  reducer: {
    bankAccounts: bankAccountsReducer,
  },
});

export default store;
