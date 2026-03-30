import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, authHeaders } from "../lib/apiClient";

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

export const verifyBankAccount = createAsyncThunk(
  "bankAccounts/verifyBankAccount",
  async ({ bankCode, accountNumber }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/api/v1/banks/verify",
        {
          bank_code: bankCode,
          account_number: accountNumber,
        },
        authHeaders()
      );

      return res?.data?.data || null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to verify bank account.")
      );
    }
  }
);

export const addBankAccount = createAsyncThunk(
  "bankAccounts/addBankAccount",
  async ({ bankCode, accountNumber, setAsDefault }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/api/v1/organiser/kyc/bank-accounts",
        {
          bank_code: bankCode,
          account_number: accountNumber,
          set_as_default: Boolean(setAsDefault),
        },
        authHeaders()
      );

      return res?.data || {};
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to add bank account.")
      );
    }
  }
);

export const deleteBankAccount = createAsyncThunk(
  "bankAccounts/deleteBankAccount",
  async ({ accountId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(
        `/api/v1/organiser/kyc/bank-accounts/${accountId}`,
        authHeaders()
      );

      return {
        accountId,
        message: res?.data?.message || "Bank account deleted successfully.",
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to delete bank account.")
      );
    }
  }
);

export const setDefaultBankAccount = createAsyncThunk(
  "bankAccounts/setDefaultBankAccount",
  async ({ accountId }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `/api/v1/organiser/kyc/bank-accounts/${accountId}/set-default`,
        {},
        authHeaders()
      );

      return {
        accountId,
        message:
          res?.data?.message || "Default bank account updated successfully.",
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to update default bank account.")
      );
    }
  }
);

const initialAsyncState = {
  status: "idle",
  error: null,
};

const initialState = {
  verification: {
    status: "idle",
    error: null,
    data: null,
  },
  add: initialAsyncState,
  delete: {
    ...initialAsyncState,
    accountId: null,
  },
  setDefault: {
    ...initialAsyncState,
    accountId: null,
  },
};

const bankAccountsSlice = createSlice({
  name: "bankAccounts",
  initialState,
  reducers: {
    clearBankVerification(state) {
      state.verification = {
        status: "idle",
        error: null,
        data: null,
      };
    },
    clearBankMutationState(state, action) {
      const target = action.payload;
      if (target === "add") {
        state.add = { ...initialAsyncState };
      }
      if (target === "delete") {
        state.delete = { ...initialAsyncState, accountId: null };
      }
      if (target === "setDefault") {
        state.setDefault = { ...initialAsyncState, accountId: null };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyBankAccount.pending, (state) => {
        state.verification.status = "loading";
        state.verification.error = null;
        state.verification.data = null;
      })
      .addCase(verifyBankAccount.fulfilled, (state, action) => {
        state.verification.status = "succeeded";
        state.verification.data = action.payload;
      })
      .addCase(verifyBankAccount.rejected, (state, action) => {
        state.verification.status = "failed";
        state.verification.error =
          action.payload || "Unable to verify bank account.";
        state.verification.data = null;
      })
      .addCase(addBankAccount.pending, (state) => {
        state.add.status = "loading";
        state.add.error = null;
      })
      .addCase(addBankAccount.fulfilled, (state) => {
        state.add.status = "succeeded";
      })
      .addCase(addBankAccount.rejected, (state, action) => {
        state.add.status = "failed";
        state.add.error = action.payload || "Unable to add bank account.";
      })
      .addCase(deleteBankAccount.pending, (state, action) => {
        state.delete.status = "loading";
        state.delete.error = null;
        state.delete.accountId = action.meta.arg.accountId;
      })
      .addCase(deleteBankAccount.fulfilled, (state) => {
        state.delete.status = "succeeded";
      })
      .addCase(deleteBankAccount.rejected, (state, action) => {
        state.delete.status = "failed";
        state.delete.error = action.payload || "Unable to delete bank account.";
      })
      .addCase(setDefaultBankAccount.pending, (state, action) => {
        state.setDefault.status = "loading";
        state.setDefault.error = null;
        state.setDefault.accountId = action.meta.arg.accountId;
      })
      .addCase(setDefaultBankAccount.fulfilled, (state) => {
        state.setDefault.status = "succeeded";
      })
      .addCase(setDefaultBankAccount.rejected, (state, action) => {
        state.setDefault.status = "failed";
        state.setDefault.error =
          action.payload || "Unable to update default bank account.";
      });
  },
});

export const { clearBankVerification, clearBankMutationState } =
  bankAccountsSlice.actions;

export default bankAccountsSlice.reducer;
