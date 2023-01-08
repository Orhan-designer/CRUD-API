import { IncomingHttpHeaders } from "http";

export interface IRequestOptions {
    host: string;
    port: number;
    path: string | any;
    method: string | any;
    headers: IncomingHttpHeaders
}