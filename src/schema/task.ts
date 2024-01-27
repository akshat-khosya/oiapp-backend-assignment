import { object, string, date } from "yup";

const createTaskSchema = object({
  body: object({
    title: string().required("Title is required"),
    description: string().required("Description is required"),
    dueDate: date().required("Due date is required").nullable(),
  }),
  headers: object({
    authorization: string().required("Authorization header is required"),
  }),
});

const createSubTaskSchema = object({
  body: object({
    taskId: string()
      .required("Task ID is required")
      .matches(/^[a-f\d]{24}$/i, "Invalid TaskId "),
  }),
  headers: object({
    authorization: string().required("Authorization header is required"),
  }),
});

const deleteTaskSchema = object({
  body: object({
    taskId: string()
      .required("Task ID is required")
      .matches(/^[a-f\d]{24}$/i, "Invalid TaskId "),
  }),
  headers: object({
    authorization: string().required("Authorization header is required"),
  }),
});

export { createTaskSchema, createSubTaskSchema, deleteTaskSchema };
