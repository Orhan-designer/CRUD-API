import { handleRequest } from "./users-requests";

process.on("message", (data: any) => {
    handleRequest(data, false);
});