import * as yup from "yup";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup.string().required("Password is required"),
});

export const registerSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .max(255)
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      passwordRegex,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), ""], "Passwords must match"),
  role: yup
    .string()
    .oneOf(["U", "O"], "Invalid role selected")
    .required("Role is required"),
});

export const editorRegisterSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      passwordRegex,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), ""], "Passwords must match"),
});
