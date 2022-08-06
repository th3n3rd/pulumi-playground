import { ConfigMap, InlineProgramArgs, LocalWorkspace, LocalWorkspaceOptions, PulumiFn } from "@pulumi/pulumi/automation"

export interface AutomationArgs {
    inlineProgram: PulumiFn
    backendUrl: string
    envVars?: Record<string, string>
    providerConfig: ConfigMap
}

export const deploy = async (args: AutomationArgs) => {
    const stack = await createOrSelectStack(args)
    const result = await stack.up()
    return result
}

async function createOrSelectStack(args: AutomationArgs) {
    const programArgs: InlineProgramArgs = {
        stackName: "local",
        projectName: "playground",
        program: args.inlineProgram
    }
    const workspaceOptions: LocalWorkspaceOptions = {
        projectSettings: {
            name: programArgs.projectName,
            runtime: "nodejs",
            backend: {
                url: args.backendUrl
            }
        },
        envVars: args.envVars
    }
    const stack = await LocalWorkspace.createOrSelectStack(programArgs, workspaceOptions)
    await stack.setAllConfig(args.providerConfig)
    return stack
}

