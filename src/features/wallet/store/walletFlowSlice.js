import { createSlice } from "@reduxjs/toolkit";
import {
  loadLastWalletFunding,
  loadPendingWalletPurchase,
  persistLastWalletFunding,
  persistPendingWalletPurchase,
} from "../walletFlowStorage";

const initialState = {
  pendingPurchase: loadPendingWalletPurchase(),
  lastFunding: loadLastWalletFunding(),
};

const walletFlowSlice = createSlice({
  name: "walletFlow",
  initialState,
  reducers: {
    setPendingPurchaseIntent(state, action) {
      state.pendingPurchase = {
        quantity: 1,
        ...action.payload,
      };
      persistPendingWalletPurchase(state.pendingPurchase);
    },
    markPendingPurchaseRetryAttempted(state, action) {
      if (!state.pendingPurchase) return;

      state.pendingPurchase = {
        ...state.pendingPurchase,
        autoRetryReference: action.payload,
      };
      persistPendingWalletPurchase(state.pendingPurchase);
    },
    clearPendingPurchaseIntent(state) {
      state.pendingPurchase = null;
      persistPendingWalletPurchase(null);
    },
    setLastFundingContext(state, action) {
      state.lastFunding = action.payload;
      persistLastWalletFunding(state.lastFunding);
    },
    clearLastFundingContext(state) {
      state.lastFunding = null;
      persistLastWalletFunding(null);
    },
  },
});

export const {
  setPendingPurchaseIntent,
  markPendingPurchaseRetryAttempted,
  clearPendingPurchaseIntent,
  setLastFundingContext,
  clearLastFundingContext,
} = walletFlowSlice.actions;

export const selectPendingWalletPurchase = (state) =>
  state.walletFlow.pendingPurchase;
export const selectLastWalletFunding = (state) => state.walletFlow.lastFunding;

export default walletFlowSlice.reducer;
