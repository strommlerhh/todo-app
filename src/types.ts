export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}