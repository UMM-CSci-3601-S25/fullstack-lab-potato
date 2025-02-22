export interface Todo {
  _id: string;
  owner: string;
  category: string;
  body: string;
  status: boolean;
}

export type TodoCategory = 'video games' | 'groceries' | 'homework' | 'software design';
