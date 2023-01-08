export const argsParser = () => {
    const args = process.argv.slice(2);

    const dict: any = {};

    for (let arg of args) {
        if (arg.startsWith('--')) {
            const [key, value] = arg.split('=');

            dict[key.slice(2)] = value;
        }
    }

    return dict;
}