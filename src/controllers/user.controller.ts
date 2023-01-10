import { IUser } from "src/models/users.interface";
import { UserService } from "src/services/user.service";

export class UserController {
    constructor(private readonly usersService: UserService) { }

    public createUser(data: IUser): Promise<IUser> {
        this.usersService.validateData(data);
        return this.usersService.createUser(data);
    }

    public getAllUsers(): Promise<IUser[]> {
        return this.usersService.getAllUsers();
    }

    public getUserById(id: string): Promise<IUser> {
        this.usersService.validateUserId(id);
        return this.usersService.getUserById(id);
    }

    public editUser(data: IUser, id: string): Promise<IUser> {
        this.usersService.validateUserId(id);
        this.usersService.validateData(data);
        return this.usersService.editUser(data, id);
    }

    public deleteUser(id: string): Promise<null> {
        this.usersService.validateUserId(id);
        return this.usersService.deleteUser(id);
    }
}