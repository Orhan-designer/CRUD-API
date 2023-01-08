import { resolve } from 'path';
import { cwd } from 'process';

export const userPath = resolve(cwd(), 'src/in-memory-db/users-db.ts');
export const ERR_USER_ID_INVALID: string = 'User id is invalid';
export const ERR_USER_NOT_FOUND: string = 'User not found';
export const ERR_INVALID_DATA: string = 'Invalid Data';
export const ERR_UNSUPPORTED_OPERATION = 'Unsupported operation';
export const ERR_RESOURCE_NOT_FOUND = "Request resource doesn't exist";
export const ERR_UNEXPECTED_ERROR = "Unexpected error has ocurred, try again later";
export const validationErrors = {
    USERNAME_NOT_EXIST: ERR_INVALID_DATA + "('Username' field is required)",
    AGE_NOT_EXIST: ERR_INVALID_DATA + "('Age' field is required)",
    HOBBIES_NOT_EXIST: ERR_INVALID_DATA + "('Hobbies' field is required)",
    USERNAME_IS_INVALID: ERR_INVALID_DATA + "(Incorrect value of 'username' field)",
    AGE_IS_INVALID: ERR_INVALID_DATA + "(Incorrect value of 'age' field)",
    HOBBIES_IS_INVALID: ERR_INVALID_DATA + "(Incorrect value of 'hobbies' field)"
}
