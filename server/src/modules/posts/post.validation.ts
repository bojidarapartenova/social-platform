import * as yup from "yup";

export const createPostSchema = yup.object({
    type: yup.string().oneOf(["photo", "text"]).required(),
    caption: yup.string().max(2000).default(""),
    mediaUrls: yup.array().of(yup.string().url()).when("type", {
        is: "photo",
        then: (schema) => schema.min(1, "Photo posts require at least one image").required(),
    }),
    filter: yup.string().oneOf(["none", "negative", "blur", "sobel"]).default("none"),
    groupId: yup.string().nullable().default(null),
});