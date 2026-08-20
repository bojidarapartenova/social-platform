import * as yup from "yup";

function isValidMediaSrc(value?: string) {
    if (!value) return false;
    return /^https?:\/\//.test(value) || value.startsWith("/") || /^data:image\//.test(value);
}

const mediaItemSchema = yup.object({
    url: yup.string().required().test("is-valid-src", "Must be a valid URL or a local path starting with /", isValidMediaSrc),
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

export const updatePostSchema = yup.object({
    type: yup.string().oneOf(["photo", "text"]),
    caption: yup.string().max(2000),
    media: yup.array().of(mediaItemSchema),
    groupId: yup.string().nullable(),
});