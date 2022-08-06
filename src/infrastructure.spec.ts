import { UpResult } from "@pulumi/pulumi/automation"
import { randomUUID } from "crypto"
import Dockerode from "dockerode"
import * as fs from "fs"
import { deploy } from "./automation"
import { infrastructure } from "./infrastructure"

describe("Infrastructure", () => {
    const localstackEndpoint = ephemeralLocalstack()
    const stateBackend = ephemeralStateBackend()
    const testTimeout = 120_000
    let deployment: UpResult

    beforeAll(async () => {
        deployment = await deployInfrastructure()
    }, testTimeout)

    it("creates the playground stack successfully", () => {
        expectResultToContain("Stack playground-local created")
    })

    it("creates an s3 bucket successfully", () => {
        expectResultToContain("Bucket my-bucket created")
    })

    function expectResultToContain(message: string) {
        expect(deployment.stdout).toContain(message)
    }

    async function deployInfrastructure() {
        return deploy(
            infrastructure,
            stateBackend,
            {
                PULUMI_CONFIG_PASSPHRASE: "irrelevant"
            },
            {
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
            }
        )
    }

    function ephemeralStateBackend() {
        const dirPath = `${__dirname}/test-${randomUUID()}`
        beforeAll(() => fs.mkdirSync(dirPath))
        afterAll(() => fs.rmSync(dirPath, { recursive: true, force: true }))
        return `file://${dirPath}`
    }

    function ephemeralLocalstack() {
        const docker = new Dockerode()
        const creation = docker.createContainer({
            Image: "localstack/localstack",
            Tty: true,
            ExposedPorts: {
                "4566/tcp": {}
            },
            HostConfig: {
                PortBindings: {
                    "4566/tcp": [{ "HostPort": "4566/tcp" }]
                }
            }
        })
        let container: Dockerode.Container
        beforeAll(async () => {
            container = await creation
            await container.start()
        })
        afterAll(async () => {
            await container.remove({ force: true })
        })
        return "http://localhost:4566"
    }

})

