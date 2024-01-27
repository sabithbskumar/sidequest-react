import { ChangeEvent, FormEvent, useState } from "react";

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
        autoComplete="off"
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
          <div className="flex flex-col gap-2">
            <input
              type="number"
              className="w-full min-w-0 p-4 text-neutral-600 outline-none rounded"
              placeholder="Amount"
              name="amount"
              min={0}
              step="any"
              value={formValues.amount}
              onChange={handleChange}
              required={true}
              autoFocus={true}
            />
            <input
              type="text"
              className="w-full min-w-0 p-4 text-neutral-600 outline-none rounded"
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

export { TransactionForm };
export type { TransactionFormData };
