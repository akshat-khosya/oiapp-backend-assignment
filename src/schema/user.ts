import { object, string, number } from "yup";

const createUserSchema = object({
  body: object({
    phoneNumber: string()
      .required("Phone Number is Required")
      .matches(/^\d{10}$/, "Phone Number must be 10 digits"),
    priority: number()
      .required("Priority is Required")
      .oneOf([0, 1, 2], "Priority must be 0, 1, or 2"),
  }),
  headers: object({
    "content-type": string()
      .required("Content Type is Required")
      .equals(["application/json"], "Content Type must be application/json"),
  }),
});

const userLoginSchema = object({
  body: object({
    phoneNumber: string()
      .required("Phone Number is Required")
      .matches(/^\d{10}$/, "Phone Number must be 10 digits"),
  }),
  headers: object({
    "content-type": string()
      .required("Content Type is Required")
      .equals(["application/json"], "Content Type must be application/json"),
  }),
});

export { userLoginSchema, createUserSchema };
