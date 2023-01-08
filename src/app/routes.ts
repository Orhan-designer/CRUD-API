import { IncomingMessage, ServerResponse } from "http";
import { NotFoundError, ValidationError } from "./errors";
import { UsersController } from "../users/users.controller";
import { UsersService } from "../users/users.service";
import { ERR_RESOURCE_NOT_FOUND, ERR_UNSUPPORTED_OPERATION } from "./constants";

const usersController = new UsersController(new UsersService())

export const routes = async (req: IncomingMessage, res: ServerResponse) => {
    console.log(req)
    console.log(res)
    console.log(`Worker ${process.pid} requested`);

    res.setHeader("Content-Type", "application/json");

    const parts = req.url!.split('/').filter(Boolean);
    const buffers = [] as any;

    for await (let chunk of req) {
        buffers.push(chunk)
    }

    const body = Buffer.concat(buffers).toString();

    if (`${parts[0]}/${parts[1]}` === 'api/users' && !parts[3]) {
        let result;
        let statusCode = 200;

        try {
            switch (req.method) {
                case 'POST':
                    if (parts[2]) {
                        throw new NotFoundError(ERR_RESOURCE_NOT_FOUND)
                    }

                    result = await usersController.create(body);
                    statusCode = 201;
                    break;
            }
        } catch (error: any) {
            if (error instanceof ValidationError) {
                statusCode = 400;
            } else if (error instanceof NotFoundError) {
                statusCode = 404;
            } else if (error instanceof Error) {
                statusCode = 500;
            }

            result = { code: statusCode, message: error.message }
        }

        res.writeHead(statusCode);
        res.end(JSON.stringify(result));

    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ code: 404, message: ERR_RESOURCE_NOT_FOUND }));
    }
}