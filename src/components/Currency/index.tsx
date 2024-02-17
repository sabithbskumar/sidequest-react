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
import EditIcon from "~icons/material-symbols-light/edit-rounded";
import DeleteIcon from "~icons/material-symbols-light/delete-rounded";
import RestoreIcon from "~icons/material-symbols-light/restore-from-trash-rounded";

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
            <div className="mx-auto grid grid-cols-3 divide-x divide-neutral-600 gap-2 p-2 grow flex-wrap min-w-0 md:min-w-96">
              {Object.entries(tallyFinances()).map(([key, value]) => {
                console.log();
                return (
                  <div
                    key={key}
                    className="flex flex-col px-2 text-center basis-0 grow"
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
              className="group/transaction rounded flex justify-between bg-neutral-600 bg-opacity-20 hover:bg-opacity-80 shadow-sm max-w-5xl h-14 overflow-clip shrink-0"
            >
              <div className="grow p-2 h-full inline-flex items-center gap-2 overflow-hidden">
                <span
                  className={`px-2 font-semibold shrink-0 font-mono ${
                    type === "income"
                      ? "text-green-500 before:content-['+']"
                      : "text-red-500 before:content-['-']"
                  } before:px-1 min-w-[10ch] border-r border-neutral-600`}
                >
                  {amount}
                </span>
                <span className="px-3 truncate">{note}</span>
              </div>
              <div className="shrink-0 max-w-0 group-hover/transaction:max-w-28 group-hover/transaction:w-28 group-focus-within/transaction:max-w-28 group-focus-within/transaction:w-28 transition-[max-width]">
                <div className="ml-auto h-full inline-flex">
                  <button
                    type="button"
                    className="outline-none text-neutral-400 hover:text-white focus:ring-inset focus:ring rounded"
                    onClick={() => {
                      setEditTransactionId(id);
                      setIsModalVisible(true);
                    }}
                  >
                    <EditIcon className="size-14 p-3 shrink-0" />
                  </button>
                  {transactions.deleted.includes(id) ? (
                    <button
                      className="outline-none text-neutral-400 hover:text-white focus:ring-inset focus:ring rounded"
                      type="button"
                      onClick={() => {
                        dispatch({
                          type: TransactionAction.RESTORE,
                          payload: id,
                        });
                        showToast(`Transaction Restored`);
                      }}
                    >
                      <RestoreIcon className="size-14 p-3 shrink-0" />
                    </button>
                  ) : (
                    <button
                      className="outline-none text-neutral-400 hover:text-red-500 focus:ring-inset focus:ring rounded"
                      type="button"
                      onClick={() => {
                        dispatch({
                          type: TransactionAction.DELETE,
                          payload: id,
                        });
                        showToast(`Transaction Deleted`);
                      }}
                    >
                      <DeleteIcon className="size-14 p-3 shrink-0" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="size-14 bg-blue-500 absolute rounded-2xl right-4 bottom-4"
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        <AddIcon className="w-auto h-full p-2 shrink-0" />
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
