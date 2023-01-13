import "dotenv/config";
import http, { IncomingMessage, ServerResponse } from "http";
import routes from "./routes";
import cluster from "cluster";
import { parseArgs } from "../utils/args";
import loadBalancer from "./load-balancer";
import { cpus } from "os";
import { userPath } from "./constants";
import { fork } from "child_process";
import { IUser } from "src/models/users";
import { IRequestOptions } from "../models/request";

const PORT: number = +process.env.PORT || 4000;
export const primaryServer = http.createServer();
export const workerServer = http.createServer(routes);

export function startApp(): void {
    const args: any = parseArgs();

    if (args["--multi"]) {
        if (cluster.isPrimary) {
            const usersDB: any = fork(userPath);
            const cpusAmount: number = cpus().length;

            let currentWorker: any;
            let i: number = 1;

            primaryServer
                .listen(PORT, () => {
                    console.log(`Load Balancer server running at http://localhost:${PORT}/`);
                })
                .on("request", (req: IncomingMessage, res: ServerResponse) => {
                    const options: IRequestOptions = {
                        host: "localhost",
                        port: PORT + i++,
                        path: req.url,
                        method: req.method,
                        headers: req.headers,
                    };
                    loadBalancer(req, res, options);

                    if (i === cpusAmount + 1) {
                        i = 1;
                    }
                });

            for (let i = 0; i < cpusAmount; i++) {
                cluster.fork({ WORKER_PORT: PORT + i + 1 });
            }

            cluster.on("exit", (worker: any) => {
                console.log(`worker ${worker.process.pid} died`);
            });

            cluster.on("message", (worker: any, data: any) => {
                currentWorker = worker;
                usersDB.send({ method: data.method, data: data.data });
            });

            usersDB.on("message", (users: IUser[]) => {
                currentWorker.send(users);
            });
        } else {
            const PORT: number = +process.env.WORKER_PORT;

            workerServer
                .listen(PORT, () => {
                    console.log(`Worker ${process.pid} server running at http://localhost:${PORT}/`);
                })
                .on("request", () => {
                    const requestPort: number = workerServer.address()["port"];
                    console.log(`Server request at http://localhost:${requestPort}/`);
                });
        }
    } else {
        workerServer
            .listen(PORT, () => {
                console.log(`Server running at http://localhost:${PORT}/`);
            })
            .on("request", () => {
                const requestPort: number = workerServer.address()["port"];
                console.log(`Server request at http://localhost:${requestPort}/`);
            });
    }

    process.on("SIGINT", async () => {
        workerServer.close();
        primaryServer.close();
        process.exit();
    });
}