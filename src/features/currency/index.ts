interface State {
  transactions: string[];
  deleted: string[];
  transactionRecords: Record<string, Transaction>;
}

interface TransactionData {
  amount: string;
  note: string;
  type: string;
}

interface Transaction extends TransactionData {
  time: string;
}

function makeTransaction({ amount, time, note = "", type }: Transaction) {
  return { amount, time, note, type };
}

enum TransactionAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  RESTORE = "RESTORE",
  LOAD = "LOAD",
}

interface TransactionCreate {
  type: TransactionAction.CREATE;
  payload: TransactionData;
}
interface TransactionUpdate {
  type: TransactionAction.UPDATE;
  payload: { id: string } & TransactionData;
}
interface TransactionDelete {
  type: TransactionAction.DELETE;
  payload: string;
}
interface TransactionRestore {
  type: TransactionAction.RESTORE;
  payload: string;
}
interface TransactionLoad {
  type: TransactionAction.LOAD;
  payload: State;
}

type TransactionActions =
  | TransactionCreate
  | TransactionUpdate
  | TransactionDelete
  | TransactionRestore
  | TransactionLoad;

function transactionReducer(state: State, action: TransactionActions) {
  switch (action.type) {
    case TransactionAction.CREATE: {
      const id = Date.now().toString();
      return {
        ...state,
        transactionRecords: {
          ...state.transactionRecords,
          [id]: makeTransaction({ ...action.payload, time: id }),
        },
        transactions: [...state.transactions, id],
      };
    }
    case TransactionAction.UPDATE: {
      const { id, amount, note } = action.payload;
      return {
        ...state,
        transactionRecords: {
          ...state.transactionRecords,
          [id]: { ...state.transactionRecords[id], amount, note },
        },
      };
    }
    case TransactionAction.DELETE: {
      if (state.deleted.includes(action.payload)) return state;
      return {
        ...state,
        transactions: state.transactions.filter(
          (transactionId) => transactionId !== action.payload
        ),
        deleted: [...state.deleted, action.payload],
      };
    }
    case TransactionAction.RESTORE: {
      if (state.transactions.includes(action.payload)) return state;
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
        deleted: state.deleted.filter((taskId) => taskId !== action.payload),
      };
    }
    case TransactionAction.LOAD: {
      return action.payload;
    }
  }
}

export { transactionReducer, TransactionAction };
export type { TransactionActions, TransactionData, State };
