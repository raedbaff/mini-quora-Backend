export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}
export interface LoginDTO {
  email: string;
  password: string;
}
export interface updateUserDto {
  username?: string;
  email?: string;
  password?: string;
}
