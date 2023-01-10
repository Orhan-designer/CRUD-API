import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { NotFoundError, ValidationError, UnsupportedMethodError } from "./errors";
import { ERR_RESOURCE_NOT_FOUND, ERR_UNEXPECTED_ERROR, ERR_UNSUPPORTED_OPERATION } from "./constants";
import { UserController } from "src/controllers/user.controller";
import { UserService } from "src/services/user.service";

const usersService: UserService = new UserService();
const usersController: UserController = new UserController(usersService);

export default function routes(req: IncomingMessage, res: ServerResponse): void {
    try {
        res.setHeader("Content-Type", "application/json");
        const data: Uint8Array[] = [];

        req.on("data", (chunk) => {
            data.push(chunk);
        });

        req.on("end", async () => {
            const path: string = url.parse(req.url, true).pathname;
            const [apiUrl, usersUrl, id, ...params]: string[] = path.split("/").filter((el) => el);
            const reqUrl: string = `${apiUrl}/${usersUrl}`;

            if (reqUrl === "api/users" && !params.length) {
                let status: number = 200;
                let result: any;

                try {
                    const body: any = data.length ? JSON.parse(Buffer.concat(data).toString()) : {};
                    switch (req.method) {
                        case "POST": {
                            if (id) {
                                throw new NotFoundError(ERR_RESOURCE_NOT_FOUND);
                            }
                            result = await usersController.createUser(body);
                            status = 201;
                            break;
                        }

                        case "GET": {
                            if (id) {
                                result = await usersController.getUserById(id);
                            } else {
                                result = await usersController.getAllUsers();
                            }
                            break;
                        }

                        case "PUT": {
                            result = await usersController.editUser(body, id);
                            status = 200;
                            break;
                        }

                        case "DELETE": {
                            result = await usersController.deleteUser(id);
                            status = 204;
                            break;
                        }

                        default: {
                            throw new UnsupportedMethodError(ERR_UNSUPPORTED_OPERATION);
                        }
                    }
                } catch (error: any) {
                    let message: string = "";

                    if (error instanceof NotFoundError) {
                        status = 404;
                    } else if (error instanceof ValidationError) {
                        status = 400;
                    } else if (error instanceof UnsupportedMethodError) {
                        status = 405;
                    } else {
                        status = 500;
                        message = ERR_UNEXPECTED_ERROR;
                    }

                    console.log(error.message);
                    result = { code: status, message: message || error.message };
                }
                res.writeHead(status);
                res.end(JSON.stringify(result));
            } else {
                res.writeHead(404);
                res.end(
                    JSON.stringify({
                        code: 404,
                        message: ERR_RESOURCE_NOT_FOUND,
                    })
                );
            }
        });
    } catch (error: any) {
        console.log(error.message);
        res.writeHead(500);
        res.end(
            JSON.stringify({
                code: 500,
                message: ERR_UNEXPECTED_ERROR,
            })
        );
    }
}