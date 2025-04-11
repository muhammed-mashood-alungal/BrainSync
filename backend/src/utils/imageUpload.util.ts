import cloudinary from '../configs/cloudinary.configs';

export const handleUpload = async (
  file: Express.Multer.File
): Promise<{ url: string; publicId: string }> => {
  try {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const res = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
    });
    return { url: res.secure_url, publicId: res.public_id };
  } catch (error) {
    throw new Error(`Failed to upload file: ${error}`);
  }
};
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Failed to delete image: ${error}`);
  }
};
