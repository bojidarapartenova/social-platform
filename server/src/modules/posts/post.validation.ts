import * as yup from "yup";

export const createPostSchema = yup.object({
    type: yup.string().oneOf(["photo", "text"]).required(),
    caption: yup.string().max(2000).default(""),
    mediaUrl: yup.string().url("mediaUrl must be a valid URL").when("type", {
        is: "photo",
        then: (schema) => schema.required("Photo posts require a mediaUrl"),
    }),
    filter: yup.string().oneOf(["none", "negative", "blur", "sobel"]).default("none"),
    groupId: yup.string().nullable().default(null),
});