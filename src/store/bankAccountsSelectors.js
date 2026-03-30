export const selectBankAccountsVerification = (state) =>
  state.bankAccounts.verification;

export const selectVerifiedBankAccount = (state) =>
  state.bankAccounts.verification.data;

export const selectIsVerifyingBankAccount = (state) =>
  state.bankAccounts.verification.status === "loading";

export const selectBankAccountAddState = (state) => state.bankAccounts.add;

export const selectIsAddingBankAccount = (state) =>
  state.bankAccounts.add.status === "loading";

export const selectBankAccountDeleteState = (state) => state.bankAccounts.delete;

export const selectDeletingBankAccountId = (state) =>
  state.bankAccounts.delete.accountId;

export const selectIsDeletingBankAccount = (state) =>
  state.bankAccounts.delete.status === "loading";

export const selectBankAccountSetDefaultState = (state) =>
  state.bankAccounts.setDefault;

export const selectDefaultingBankAccountId = (state) =>
  state.bankAccounts.setDefault.accountId;

export const selectIsSettingDefaultBankAccount = (state) =>
  state.bankAccounts.setDefault.status === "loading";
