import * as yup from "yup";

export const spaceSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .test("words-count", "Title must be between 2 and 16 words", (value) => {
      if (!value) return true; // Skip validation if value is empty
      const words = value.trim().split(/\s+/);
      return words.length >= 2 && words.length <= 16;
    }),
  description: yup
    .string()
    .required("Description is required")
    .test(
      "words-count",
      "Description must be between 4 and 64 words",
      (value) => {
        if (!value) return true;
        const words = value.trim().split(/\s+/);
        return words.length >= 4 && words.length <= 64;
      }
    ),
  coverImage: yup.string().nullable(),
  isPrivate: yup.boolean().default(false),
});
