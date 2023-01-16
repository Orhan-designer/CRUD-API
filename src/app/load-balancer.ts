import http, { IncomingMessage, ServerResponse } from "http";
import { IRequestOptions } from "../models/request";

export default function loadBalancer(req: IncomingMessage, res: ServerResponse, options: IRequestOptions) {
    const proxy: any = http.request(options, (response: any) => {
        res.writeHead(response.statusCode, response.headers);
        response.pipe(res);
    });

    req.pipe(proxy);
}