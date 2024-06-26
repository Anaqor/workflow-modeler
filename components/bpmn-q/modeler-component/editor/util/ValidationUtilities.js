import NotificationHandler from "../ui/notifications/NotificationHandler";

export async function performPreDeploymentValidation(modeler) {
    const linting = modeler.get('linting');
    if (await countModelErrors(linting) > 0) {
        linting.toggle(true);
        NotificationHandler.getInstance().displayNotification({
            type: "error",
            title: "Workflow contains Errors",
            content:
                "Please solve all errors before deploying the workflow.",
            duration: 20000,
        });
        return false;
    }
    return true;
}

async function countModelErrors(linting) {
    const issues = await linting.lint();
    return Object.values(issues)
        .flatMap(array => array)
        .filter(obj => obj.category === 'error')
        .length;
}