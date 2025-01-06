export class User {
    id: number;
    username: string;
    password: string;
    email: string;
    roles: string[]; // Array for role-based access control (e.g., ['user', 'admin']).
  }