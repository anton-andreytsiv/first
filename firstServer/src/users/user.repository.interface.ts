import { UserModel, Role } from "@prisma/client";
import { User } from "./user.entity";

export interface IUserRepository {
    create: (user: User) => Promise<UserModel>;
    find: (email: string) => Promise<UserModel | null>;
    findById: (id: number) => Promise<UserModel | null>;
    getRole: (id: number) => Promise<Role | null>
}