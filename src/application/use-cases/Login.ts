import type { AuthRepository } from "@/domain/repositories/AuthRepository";
import type { User } from "@/domain/entities/User";

/** Authenticates a user by email + password. Returns null on failure. */
export class Login {
  constructor(private readonly auth: AuthRepository) {}

  execute(email: string, password: string): Promise<User | null> {
    return this.auth.findByCredentials(email.trim().toLowerCase(), password);
  }
}
