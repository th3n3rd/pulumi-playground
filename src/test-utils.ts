import Dockerode from "dockerode"
import { randomUUID } from "crypto"
import * as fs from "fs"

export function ephemeralLocalstack() {
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

export function ephemeralStateBackend() {
    const dirPath = `${__dirname}/test-${randomUUID()}`
    beforeAll(() => fs.mkdirSync(dirPath))
    afterAll(() => fs.rmSync(dirPath, { recursive: true, force: true }))
    return `file://${dirPath}`
}
