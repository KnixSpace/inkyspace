import { uploadSpaceCoverImage } from "./cloudinary";

export const uploadImageForEditor = async (
  file: File
): Promise<{ success: number; file: { url: string } }> => {
  try {
    const imageUrl = await uploadSpaceCoverImage(file);
    return {
      success: 1,
      file: {
        url: imageUrl,
      },
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: 0,
      file: {
        url: "",
      },
    };
  }
};
