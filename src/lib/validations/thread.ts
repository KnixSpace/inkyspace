import * as yup from "yup";

export const threadSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  coverImage: yup.string().nullable(),
  tags: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required("Tag ID is required"),
        name: yup.string().required("Tag name is required"),
      })
    )
    .min(1, "At least one tag is required")
    .required("Tags are required"),
  spaceId: yup.string().required("Space is required"),
});
