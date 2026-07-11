import * as yup from "yup";

const mediaItemSchema = yup.object({
    url: yup.string().url("Must be a valid URL").required(),
    filter: yup.string().oneOf(["none", "negative", "blur", "sobel"]).default("none"),
});

export const createPostSchema = yup.object({
    type: yup.string().oneOf(["photo", "text"]).required(),
    caption: yup.string().max(2000).default(""),
    media: yup.array().of(mediaItemSchema).when("type", {
        is: "photo",
        then: (schema) => schema.min(1, "Photo posts require at least one image").required(),
    }),
    groupId: yup.string().nullable().default(null),
});