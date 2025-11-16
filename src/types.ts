export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  visibility: 'private' | 'public';
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}
