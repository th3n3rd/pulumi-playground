import { ConfigMap, InlineProgramArgs, LocalWorkspace, LocalWorkspaceOptions, PulumiFn } from "@pulumi/pulumi/automation"

export const deploy = async (program: PulumiFn, backendUrl: string, envVars: Record<string, string> = {}, providerConfig: ConfigMap = {}) => {
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
    await stack.setAllConfig(providerConfig)
    const result = await stack.up()
    return result
}
