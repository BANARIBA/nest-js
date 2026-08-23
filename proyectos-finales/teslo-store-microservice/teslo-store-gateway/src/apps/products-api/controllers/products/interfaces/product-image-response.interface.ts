export interface ProductImageResponse {
  id: string;
  productId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImageFileRpcResponse
  extends ProductImageResponse {
  dataBase64: string;
}

export interface DeleteProductImageResponse {
  id: string;
  message: string;
}