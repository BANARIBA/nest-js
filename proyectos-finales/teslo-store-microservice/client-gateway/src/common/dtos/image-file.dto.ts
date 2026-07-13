export class ImageFileDto {
  public originalname!: string;
  public mimetype!: string;
  public size!: number; // bytes
  public buffer!: string; // base64 string (serializable por TCP)
  public extension!: string; // 'jpg', 'png', etc.
}
