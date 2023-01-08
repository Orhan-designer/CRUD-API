import { User } from "../entity/user";
import { IUser } from "../models/users.interface";
import { v4 as uuid_v4 } from "uuid";

const usersDB: IUser[] = [];

export function handleRequest(data: any, isPrimary: any) {
    let response: any;

    switch (data.method) {
        case "put": {
            let user: IUser = usersDB.find((el) => el.id === data.data.id)!;

            if (user) {
                user = Object.assign(user, { ...data.data.data });
                response = user;
            } else {
                response = null;
            }

            break;
        }

        case "post": {
            const newUser: IUser = Object.assign(new User(), { ...data.data.data, id: uuid_v4() });
            usersDB.push(newUser);
            response = newUser;
            break;
        }

        case "getAll": {
            response = usersDB;
            break;
        }

        case "getById": {
            let user: IUser = usersDB.find((el) => el.id === data.data.id)!;
            response = user ? user : null;
            break;
        }

        case "delete": {
            const userIndex: number = usersDB.findIndex((el) => el.id === data.data.id);

            if (userIndex >= 0) {
                usersDB.splice(userIndex, 1);
                response = "Ok";
            } else {
                response = null;
            }

            break;
        }
    }

    if (isPrimary) {
        return response;
    } else {
        process.send?.(response);
    }
}