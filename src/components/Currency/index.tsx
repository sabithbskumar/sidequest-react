import { ChangeEvent, FormEvent, useEffect, useReducer, useState } from "react";
import {
  State,
  TransactionAction,
  TransactionData,
  transactionReducer,
} from "../../features/currency";

function Currency() {
  const defaultState = {
    transactions: [],
    deleted: [],
    transactionRecords: {},
  };

  const storedTransactions = localStorage.getItem("transactions");
  const initialState = storedTransactions
    ? (JSON.parse(storedTransactions) as State)
    : defaultState;

  const [transactions, dispatch] = useReducer(transactionReducer, initialState);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const initialFormState = {
    amount: "",
    note: "",
    type: "expense",
  };
  const [transactionData, setTransactionData] =
    useState<TransactionData>(initialFormState);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setTransactionData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  function handleNewTransaction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch({ type: TransactionAction.CREATE, payload: transactionData });
    setTransactionData(initialFormState);
  }

  enum Filters {
    TRANSACTIONS = "TRANSACTIONS",
    TRASH = "TRASH",
  }
  const [filter, setFilter] = useState(Filters.TRANSACTIONS);

  function getList() {
    switch (filter) {
      case Filters.TRANSACTIONS: {
        return transactions.transactions;
      }
      case Filters.TRASH: {
        return transactions.deleted;
      }
    }
  }

  return (
    <div className="flex flex-col max-h-full h-full w-full">
      <div className="shrink-0">
        <form
          onSubmit={handleNewTransaction}
          className="flex p-2 max-w-lg m-auto"
        >
          <input
            type="number"
            className="w-28 px-4 py-2 text-neutral-600 outline-none"
            placeholder="Amount"
            name="amount"
            value={transactionData.amount}
            onChange={handleChange}
            required={true}
          />
          <input
            type="text"
            className="grow px-4 py-2 text-neutral-600 outline-none"
            placeholder="Note"
            name="note"
            value={transactionData.note}
            onChange={handleChange}
          />
          <select
            value={transactionData.type}
            name="type"
            onChange={handleChange}
            className="grow px-4 py-2 text-neutral-600 outline-none"
            required={true}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            type="submit"
            value="Add"
            className="bg-neutral-500 px-4 py-2"
          />
        </form>
        <div className="flex gap-2 px-4">
          <label>
            <input
              type="radio"
              name="filter"
              value={Filters.TRANSACTIONS}
              checked={filter === Filters.TRANSACTIONS}
              onChange={(e) => {
                setFilter(e.target.value as Filters);
              }}
            />
            <span className="p-2">Transaction</span>
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="filter"
              value={Filters.TRASH}
              checked={filter === Filters.TRASH}
              onChange={(e) => {
                setFilter(e.target.value as Filters);
              }}
            />
            <span className="p-2">Trash</span>
          </label>
          <br />
        </div>
      </div>
      <div className="grow max-w-full overflow-y-auto h-full max-h-full break-all">
        {getList().map((id) => {
          const { amount, note, type } = transactions.transactionRecords[id];
          return (
            <div key={id} className="px-4 py-2 group/transaction">
              {type === "income" ? (
                <span className="text-green-500 font-bold">+{amount}</span>
              ) : (
                <span className="text-red-500 font-bold">-{amount}</span>
              )}
              <span className="p-3">{note}</span>
              <button
                className={`opacity-0 group-hover/transaction:opacity-100 px-2`}
                onClick={() => {
                  const newAmount = prompt("Amount", amount);
                  if (newAmount)
                    dispatch({
                      type: TransactionAction.UPDATE,
                      payload: {
                        id,
                        amount: newAmount,
                        type,
                        note,
                      },
                    });
                }}
              >
                Edit
              </button>
              {transactions.deleted.includes(id) ? (
                <button
                  className={`opacity-0 group-hover/transaction:opacity-100 px-2`}
                  onClick={() => {
                    dispatch({
                      type: TransactionAction.RESTORE,
                      payload: id,
                    });
                  }}
                >
                  Restore
                </button>
              ) : (
                <button
                  className={`opacity-0 group-hover/transaction:opacity-100 px-2`}
                  onClick={() => {
                    dispatch({
                      type: TransactionAction.DELETE,
                      payload: id,
                    });
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Currency };
