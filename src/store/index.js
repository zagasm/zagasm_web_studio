import { configureStore } from "@reduxjs/toolkit";
import bankAccountsReducer from "./bankAccountsSlice";
import walletFlowReducer from "../features/wallet/store/walletFlowSlice";

export const store = configureStore({
  reducer: {
    bankAccounts: bankAccountsReducer,
    walletFlow: walletFlowReducer,
  },
});

export default store;
