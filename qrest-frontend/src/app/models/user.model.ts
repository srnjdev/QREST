export interface UserDTO {
  id: number;
  username: string;
  roles: string[];
  active: boolean;
}

export interface UserCreateDTO {
  username: string;
  password: string;
  roles?: string[];
  active?: boolean;
}

export interface UserUpdateDTO {
  username: string;
  password?: string;
  roles?: string[];
  active?: boolean;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}
