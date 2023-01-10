export function parseArgs(): any {
    return process.argv.slice(2).reduce((acc: any, el: string) => {
        acc[el] = true;
        return acc;
    }, {});
}