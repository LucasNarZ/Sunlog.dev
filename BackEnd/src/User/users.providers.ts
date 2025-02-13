import { usersRepositoryToken } from "src/constants";
import { User } from "./user.entity";

export const usersProviders = [
    {
        provide: usersRepositoryToken,
        useValue: User
    }
]