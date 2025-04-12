import { v4 as uuidV4 } from "uuid";

export const convertToWebP = async (file: File): Promise<File> => {
  if (file.type === "image/webp") return file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to convert image to WebP"));
              return;
            }
            const webpFile = new File(
              [blob],
              `${file.name.split(".")[0]}.webp`,
              {
                type: "image/webp",
              }
            );
            resolve(webpFile);
          },
          "image/webp",
          0.85
        );
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const uploadImage = async (file: File, folder: string): Promise<string> => {
  try {
    const webpFile = await convertToWebP(file);

    const filename = `${uuidV4()}`;

    const formData = new FormData();
    formData.append("file", webpFile);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );
    formData.append("folder", folder);
    formData.append("public_id", filename);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

export const uploadSpaceCoverImage = async (file: File): Promise<string> => {
  return uploadImage(file, "space-covers");
};

export const uploadProfileImage = async (file: File): Promise<string> => {
  return uploadImage(file, "profile-images");
};
