import Dockerode from "dockerode"
import { randomUUID } from "crypto"
import * as fs from "fs"
import { deploy } from "./automation"
import { PulumiFn } from "@pulumi/pulumi/automation"

type LocalstackEndpointResolver = () => Promise<string>

export function ephemeralLocalstack(): LocalstackEndpointResolver { 
    let container: Dockerode.Container
    const docker = new Dockerode()  
    
    beforeAll(async () => {
        container = await docker.createContainer({
            Image: "localstack/localstack",
            Tty: true,
            ExposedPorts: {
                "4566/tcp": {}
            },
            HostConfig: {
                PortBindings: {
                    "4566/tcp": [{ "HostPort": "0" }]
                }
            }
        })
        await container.start()
    })
    
    afterAll(async () => {
        await container.remove({ force: true })
    })
    
    return async () => {
        const info = await container.inspect()
        const port = info.NetworkSettings.Ports["4566/tcp"][0].HostPort
        return `http://localhost:${port}`
    }
}

export function ephemeralStateBackend() {
    const dirPath = `${__dirname}/test-${randomUUID()}`
    beforeAll(() => fs.mkdirSync(dirPath))
    afterAll(() => fs.rmSync(dirPath, { recursive: true, force: true }))
    return `file://${dirPath}`
}

export async function deployToLocalstack(
    inlineProgram: PulumiFn,
    stateBackend: string,
    localstackEndpoint: string
) {
    return deploy(
        {
            inlineProgram: inlineProgram,
            backendUrl: stateBackend,
            envVars: {
                PULUMI_CONFIG_PASSPHRASE: "irrelevant"
            },
            providerConfig: {
                "aws:region": { value: "eu-west-1" },
                "aws:accessKey": { value: "test", secret: true },
                "aws:secretKey": { value: "test", secret: true },
                "aws:skipCredentialsValidation": { value: "true" },
                "aws:skipRequestingAccountId": { value: "true" },
                "aws:s3ForcePathStyle": { value: "true" },
                "aws:endpoints": {
                    value: JSON.stringify([
                        {
                            "s3": localstackEndpoint
                        }
                    ])
                }
            },
        }
    )
}
