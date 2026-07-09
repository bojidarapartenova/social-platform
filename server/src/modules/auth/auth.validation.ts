import * as yup from "yup";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;

export const registerSchema = yup.object({
    username: yup.string().min(3).required(),
    email: yup.string().email("Must be a valid email address").required(),
    password: yup
        .string()
        .matches(passwordRegex, "Password must be at least 10 characters and include one uppercase letter, one digit, and one special character")
        .required(),
});

export const loginSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
});