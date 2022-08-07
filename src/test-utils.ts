import Dockerode from "dockerode"
import { randomUUID } from "crypto"
import * as fs from "fs"

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
