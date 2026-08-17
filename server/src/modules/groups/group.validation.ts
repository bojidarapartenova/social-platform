import * as yup from "yup";

export const createGroupSchema = yup.object({
    name: yup.string().min(2).max(60).required(),
    description: yup.string().max(500).default(""),
    avatarUrl: yup.string().url("Must be a valid URL").default(""),
});

export const updateGroupSchema = yup.object({
    name: yup.string().min(2).max(60),
    description: yup.string().max(500),
    avatarUrl: yup.string().url("Must be a valid URL"),
});