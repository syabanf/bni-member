import type { AuthRepository } from "@/domain/repositories/AuthRepository";
import type { User } from "@/domain/entities/User";
import { usersSeed } from "../data/users.data";

/** In-memory adapter for {@link AuthRepository}. */
export class InMemoryAuthRepository implements AuthRepository {
  async findByCredentials(email: string, password: string): Promise<User | null> {
    const found = usersSeed.find(
      (u) => u.email.toLowerCase() === email && u.password === password,
    );
    if (!found) return null;
    return {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      chapterId: found.chapterId,
      chapterName: found.chapterName,
    };
  }
}
