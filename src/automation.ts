import { InlineProgramArgs, LocalWorkspace, LocalWorkspaceOptions, PulumiFn } from "@pulumi/pulumi/automation"

export const deploy = async (program: PulumiFn, backendUrl: string, envVars: Record<string, string> = {}) => {
    const args: InlineProgramArgs = {
        stackName: "local",
        projectName: "playground",
        program: program
    }
    const options: LocalWorkspaceOptions = {
        projectSettings: {
            name: args.projectName,
            runtime: "nodejs",
            backend: {
                url: backendUrl
            }
        },
        envVars: envVars
    }
    const stack = await LocalWorkspace.createStack(args, options)
    const result = await stack.up()
    return {
        result: result,
        resources: (await stack.exportStack()).deployment.resources
    }
}
