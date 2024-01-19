import { ChangeEvent, FormEvent, useEffect, useReducer, useState } from "react";
import {
  State,
  TransactionAction,
  transactionReducer,
} from "../../features/currency";
import AddIcon from "~icons/material-symbols-light/add";
import { Modal } from "../Modal";

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

  function handleSubmit(transactionData: TransactionFormData) {
    const { id, ...data } = transactionData;
    if (id) {
      dispatch({
        type: TransactionAction.UPDATE,
        payload: { id, ...data },
      });
    } else {
      dispatch({
        type: TransactionAction.CREATE,
        payload: { ...data },
      });
    }
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editTransactionId, setEditTransactionId] = useState("");

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
                  setEditTransactionId(id);
                  setIsModalVisible(true);
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
      <Modal isVisible={isModalVisible}>
        {editTransactionId === "" ? (
          <TransactionForm
            transactionData={{
              amount: "",
              note: "",
              type: "expense",
            }}
            formOptions={{
              heading: "New Transaction",
              primaryLabel: "Add",
            }}
            onCancel={() => {
              setIsModalVisible(false);
            }}
            onSubmit={handleSubmit}
          />
        ) : (
          <TransactionForm
            transactionData={{
              id: editTransactionId,
              ...transactions.transactionRecords[editTransactionId],
            }}
            formOptions={{
              heading: "Edit Transaction",
              primaryLabel: "Edit",
            }}
            onCancel={() => {
              setEditTransactionId("");
              setIsModalVisible(false);
            }}
            onSubmit={handleSubmit}
          />
        )}
      </Modal>
    </div>
  );
}

export { Currency };

interface TransactionFormData {
  id?: string;
  amount: string;
  note: string;
  type: string;
}

interface TransactionFormProps {
  formOptions: {
    heading: string;
    primaryLabel: string;
  };
  transactionData: TransactionFormData;
  onCancel: () => void;
  onSubmit: (_: TransactionFormData) => void;
}

function TransactionForm({
  formOptions,
  transactionData,
  onCancel,
  onSubmit,
}: TransactionFormProps) {
  const initialValues = { ...transactionData };
  const [formValues, setFormValues] = useState(initialValues);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormValues((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(formValues);
    setFormValues(initialValues);
    onCancel();
  }
  return (
    <>
      <h2 className="text-center pt-2 pb-6 text-2xl">{formOptions.heading}</h2>
      <form
        onSubmit={handleSubmit}
        className="m-auto px-4 w-full grow flex flex-col justify-between"
      >
        <div className="flex flex-col gap-4">
          <div className="flex">
            <label>
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formValues.type === "expense"}
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
                checked={formValues.type === "income"}
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
              value={formValues.amount}
              onChange={handleChange}
              required={true}
              autoFocus={true}
            />
            <input
              type="text"
              className="grow p-4 text-neutral-600 outline-none rounded-e"
              placeholder="Note"
              name="note"
              value={formValues.note}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <input
            type="button"
            value="Cancel"
            className="bg-neutral-500 px-4 w-full p-4 rounded cursor-pointer"
            onClick={onCancel}
          />
          <input
            type="submit"
            value={formOptions.primaryLabel}
            className="bg-blue-500 px-4 w-full p-4 rounded cursor-pointer"
          />
        </div>
      </form>
    </>
  );
}
