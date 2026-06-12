import type { User } from "../entities/User";

/** Port (interface) for authentication. */
export interface AuthRepository {
  findByCredentials(email: string, password: string): Promise<User | null>;
}
