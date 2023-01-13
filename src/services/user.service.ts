import { ERR_USER_ID_INVALID, ERR_USER_NOT_FOUND, validationErrors } from '../app/constants';
import { IUser } from "../models/users";
import { validate } from "uuid";
import { NotFoundError, ValidationError } from "../app/errors";
import cluster from 'cluster';
import { handleRequest } from '../in-memory-db/users-requests';

export class UserService {
    process: any = process;
    usersDB?: IUser[];

    constructor() { }

    private async dbRequest(method: any, data?: any): Promise<IUser[] | IUser | any> {

        if (cluster.isPrimary) {
            return new Promise((res) => {
                res(handleRequest({ method: method, data: data }, true));
            });
        } else {
            this.process.send({ method: method, data: data });

            return new Promise((res) => {
                this.process.once("message", (response: any) => {
                    res(response);
                });
            });
        }
    }

    public async createUser(data: IUser): Promise<IUser> {
        const response: IUser = await this.dbRequest("post", { data: data });

        return new Promise((res) => {
            res(response);
        });
    }

    public async editUser(data: IUser, id: string): Promise<IUser> {
        const response: IUser | null = await this.dbRequest("put", { data: data, id: id });

        if (response) {
            return new Promise((res) => {
                res(response);
            });
        } else {
            throw new NotFoundError(ERR_USER_NOT_FOUND);
        }
    }

    public async getAllUsers(): Promise<IUser[]> {
        const response: IUser[] = await this.dbRequest("getAll");

        return new Promise((res) => {
            res(response);
        });
    }

    public async getUserById(id: string): Promise<IUser> {
        const response: IUser | null = await this.dbRequest("getById", { id: id });

        if (response) {
            return new Promise((res) => {
                res(response);
            });
        } else {
            throw new NotFoundError(ERR_USER_NOT_FOUND);
        }
    }

    public async deleteUser(id: string): Promise<null> {
        const response: any = await this.dbRequest("delete", { id: id });

        if (response) {
            return new Promise((res) => {
                res(null);
            });
        } else {
            throw new NotFoundError(ERR_USER_NOT_FOUND);
        }
    }

    public validateUserId(id: string): void {
        if (!validate(id)) {
            throw new ValidationError(ERR_USER_ID_INVALID);
        }
    }

    public validateData(body: IUser): void {
        if (body.id) delete body.id;
        let error = "";

        const {
            USERNAME_NOT_EXIST,
            AGE_NOT_EXIST,
            HOBBIES_NOT_EXIST,
            USERNAME_IS_INVALID,
            AGE_IS_INVALID,
            HOBBIES_IS_INVALID,
        } = validationErrors;
        const username: string = body.username;
        const age: number = body.age;
        const hobbies: string[] = body.hobbies;
        const usernameIsString: boolean = typeof username === "string";
        const ageIsNumber: boolean = typeof age === "number";
        const hobbiesIsArray: boolean = Array.isArray(hobbies);
        const isValidHobbies: boolean = hobbiesIsArray ? hobbies?.every((el: any) => typeof el === "string") : false;

        if (!username) {
            error = USERNAME_NOT_EXIST;
        } else if (!usernameIsString) {
            error = USERNAME_IS_INVALID;
        } else if (!age) {
            error = AGE_NOT_EXIST;
        } else if (!ageIsNumber) {
            error = AGE_IS_INVALID;
        } else if (!hobbiesIsArray) {
            error = HOBBIES_IS_INVALID;
        } else if (!hobbies) {
            error = HOBBIES_NOT_EXIST;
        } else if (!isValidHobbies) {
            error = HOBBIES_IS_INVALID;
        }

        if (error) {
            throw new ValidationError(error);
        }
    }
}