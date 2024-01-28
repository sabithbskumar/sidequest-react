import { ChangeEvent, FormEvent, useState } from "react";

interface TaskFormData {
  id?: string;
  title: string;
  description?: string;
}

interface TaskFormProps {
  formOptions: {
    heading: string;
    primaryLabel: string;
  };
  taskData: TaskFormData;
  onCancel: () => void;
  onSubmit: (_: TaskFormData) => void;
}

function TaskForm({
  formOptions,
  taskData,
  onCancel,
  onSubmit,
}: TaskFormProps) {
  const initialValues = { ...taskData };
  const [formValues, setFormValues] = useState(initialValues);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
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
        className="m-auto px-4 w-full grow flex flex-col justify-between gap-2"
      >
        <div className="grow flex flex-col gap-2">
          <input
            type="text"
            className="w-full p-4 rounded text-neutral-600 outline-none"
            placeholder="Task name"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            required={true}
            autoFocus={true}
          />
          <textarea
            className="h-full w-full p-4 rounded text-neutral-600 outline-none resize-none"
            placeholder="Description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
          />
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

export { TaskForm };
export type { TaskFormData };
