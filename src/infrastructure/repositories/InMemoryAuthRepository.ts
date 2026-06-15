import type { AuthRepository } from "@/domain/repositories/AuthRepository";
import type { User } from "@/domain/entities/User";
import { usersSeed } from "../data/users.data";

/**
 * In-memory adapter for {@link AuthRepository}. Demo mode: any credentials are
 * accepted. A known seed email signs in with that user's role (so role-based
 * nav still works); any other email signs in as a National Admin guest.
 */
export class InMemoryAuthRepository implements AuthRepository {
  async findByCredentials(email: string, _password: string): Promise<User | null> {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return null;

    const found = usersSeed.find((u) => u.email.toLowerCase() === normalized);
    if (found) {
      return {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        chapterId: found.chapterId,
        chapterName: found.chapterName,
      };
    }

    return { id: "u-guest", name: "Admin Nasional", email: email.trim(), role: "National Admin" };
  }
}
