import { useEffect, useReducer, useState } from "react";
import {
  State,
  TransactionAction,
  transactionReducer,
} from "../../features/currency";
import AddIcon from "~icons/material-symbols-light/add";
import { Modal } from "../Modal";
import { TabBar } from "../TabBar";
import useToast from "../../hooks/useToast";
import { Toast } from "../Toast";
import { TransactionForm, TransactionFormData } from "./TransactionForm";

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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editTransactionId, setEditTransactionId] = useState("");

  enum Pages {
    TRANSACTIONS = "TRANSACTIONS",
    TRASH = "TRASH",
  }
  const [page, setPage] = useState(Pages.TRANSACTIONS);

  const { showToast, toastState } = useToast();

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  function getList() {
    switch (page) {
      case Pages.TRANSACTIONS: {
        return transactions.transactions;
      }
      case Pages.TRASH: {
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
      showToast(`Transaction Updated`);
    } else {
      dispatch({
        type: TransactionAction.CREATE,
        payload: { ...data },
      });
      showToast(`Transaction Added`);
    }
  }

  function tallyFinances() {
    return transactions.transactions.reduce(
      (previous, transactionId) => {
        const record = transactions.transactionRecords[transactionId];
        const next = { ...previous };
        switch (record.type) {
          case "income":
            next.income = previous.income + parseFloat(record.amount);
            next.balance = previous.balance + parseFloat(record.amount);
            break;
          case "expense":
            next.expense = previous.expense + parseFloat(record.amount);
            next.balance = previous.balance - parseFloat(record.amount);
            break;
        }

        return next;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }

  return (
    <div className="flex flex-col max-h-full h-full w-full relative">
      <div className="shrink-0 flex flex-wrap">
        <TabBar
          options={[
            {
              label: "Transactions",
              value: Pages.TRANSACTIONS,
            },
            {
              label: "Trash",
              value: Pages.TRASH,
            },
          ]}
          name="page"
          value={page}
          onChange={(value) => {
            console.log(value);
            setPage(value as Pages);
          }}
        />
        {page === Pages.TRANSACTIONS ? (
          <div className="inline-flex px-2 w-full lg:min-w-80 lg:w-auto">
            <div className="mx-auto flex justify-evenly gap-2 p-2 grow flex-wrap min-w-0 md:min-w-96">
              {Object.entries(tallyFinances()).map(([key, value]) => {
                console.log();
                return (
                  <div
                    key={key}
                    className="flex flex-col px-2 text-center basis-0 grow border-neutral-600 first-of-type:border-r last-of-type:border-l"
                  >
                    <span className="capitalize font-bold">{key}</span>
                    <span
                      className={`font-semibold ${
                        key === "expense" || value < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {value.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
      <div className="grow overflow-y-auto h-full max-h-full break-all flex flex-col gap-2 px-2 pt-2 pb-[5.5rem]">
        {getList().map((id) => {
          const { amount, note, type } = transactions.transactionRecords[id];
          return (
            <div
              key={id}
              className="py-3 px-2 group/transaction rounded flex bg-neutral-600 bg-opacity-20 hover:bg-opacity-80 shadow-sm items-center max-w-5xl"
            >
              <span
                className={`font-semibold shrink-0 before:font-mono ${
                  type === "income"
                    ? "text-green-500 before:content-['+']"
                    : "text-red-500 before:content-['-']"
                } before:px-1`}
              >
                {amount}
              </span>
              <span className="px-3 truncate">{note}</span>

              <div className="ml-auto hidden group-hover/transaction:inline-flex">
                <input
                  type="button"
                  className="px-2 cursor-pointer"
                  onClick={() => {
                    setEditTransactionId(id);
                    setIsModalVisible(true);
                  }}
                  value="Edit"
                />
                <input
                  className="px-2 cursor-pointer"
                  value={
                    transactions.deleted.includes(id) ? "Restore" : "Delete"
                  }
                  type="button"
                  onClick={() => {
                    if (transactions.deleted.includes(id)) {
                      dispatch({
                        type: TransactionAction.RESTORE,
                        payload: id,
                      });
                      showToast(`Transaction Restored`);
                    } else {
                      dispatch({
                        type: TransactionAction.DELETE,
                        payload: id,
                      });
                      showToast(`Transaction Deleted`);
                    }
                  }}
                />
              </div>
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
              primaryLabel: "Save",
            }}
            onCancel={() => {
              setEditTransactionId("");
              setIsModalVisible(false);
            }}
            onSubmit={handleSubmit}
          />
        )}
      </Modal>
      <Toast {...toastState} />
    </div>
  );
}

export { Currency };
