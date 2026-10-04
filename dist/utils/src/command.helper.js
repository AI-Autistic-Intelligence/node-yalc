export const commandWithErrors = (command) => {
    return async (...args) => {
        try {
            await command(...args);
        }
        catch (e) {
            console.error(e);
            process.exit(1);
        }
    };
};
//# sourceMappingURL=command.helper.js.map