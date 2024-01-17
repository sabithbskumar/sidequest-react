import { ChangeEvent, FormEvent, useEffect, useReducer, useState } from "react";
import {
  State,
  TransactionAction,
  TransactionData,
  transactionReducer,
} from "../../features/currency";
import AddIcon from "~icons/material-symbols-light/add";

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
    setIsModalVisible(false);
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

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div className="flex flex-col max-h-full h-full w-full relative">
      <div className="shrink-0">
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
      <button
        className="w-14 h-14 transition-[width] hover:w-48 bg-blue-500 absolute rounded-2xl right-4 bottom-4 group/add flex items-center justify-start"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        <AddIcon className="w-auto h-full p-2 shrink-0" />
        <span className="hidden group-hover/add:block whitespace-nowrap text-clip overflow-hidden">
          Add Transaction
        </span>
      </button>
      {isModalVisible ? (
        <div className="bg-neutral-900/50 absolute flex inset-0 backdrop-blur-sm shadow-md">
          <div className="grow max-w-2xl max-h-full mx-auto p-5">
            <div className="w-full h-full bg-neutral-500/50 py-4 rounded-lg flex flex-col">
              <h2 className="text-center pt-2 pb-6 text-2xl">
                New Transaction
              </h2>
              <form
                onSubmit={handleNewTransaction}
                className="m-auto px-4 w-full grow flex flex-col justify-between"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex">
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="expense"
                        checked={transactionData.type === "expense"}
                        onChange={handleChange}
                      />
                      <span className="p-2">Expense</span>
                    </label>
                    <br />
                    <label>
                      <input
                        type="radio"
                        name="type"
                        value="income"
                        checked={transactionData.type === "income"}
                        onChange={handleChange}
                      />
                      <span className="p-2">Income</span>
                    </label>
                  </div>
                  <div className="flex">
                    <input
                      type="number"
                      className="w-40 p-4 text-neutral-600 outline-none rounded-s"
                      placeholder="Amount"
                      name="amount"
                      value={transactionData.amount}
                      onChange={handleChange}
                      required={true}
                      autoFocus={true}
                    />
                    <input
                      type="text"
                      className="grow p-4 text-neutral-600 outline-none rounded-e"
                      placeholder="Note"
                      name="note"
                      value={transactionData.note}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <input
                    type="button"
                    value="Cancel"
                    className="bg-neutral-500 px-4 w-full p-4 rounded cursor-pointer"
                    onClick={() => {
                      setIsModalVisible(false);
                    }}
                  />
                  <input
                    type="submit"
                    value="Add"
                    className="bg-blue-500 px-4 w-full p-4 rounded cursor-pointer"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { Currency };
