export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface ResourceType {
  id: string;
  name: string;
  description: string;
}

export interface ResourceFile {
  id: number;
  title: string;
  description: string;
  fileSize: string;
  fileName: string;
  filePath: string;
  categoryId: string;
  categoryName: string;
  typeId: string;
  typeName: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
