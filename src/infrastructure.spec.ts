import { infrastructure } from "./infrastructure"
import { deploy } from "./automation"
import * as fs from "fs"
import { randomUUID } from "crypto"

describe("Infrastructure", () => {
    const stateBackend = ephemeralStateBackend()
    const testTimeout = 120_000

    it("deploys all infrastructure resources successfully", async () => {
        const deployment = await deployInfrastructure()
        expect(deployment.result.stdout).toContain("Stack playground-local created")
    }, testTimeout)

    async function deployInfrastructure() {
        return deploy(
            infrastructure,
            stateBackend,
            {
                PULUMI_CONFIG_PASSPHRASE: "irrelevant"
            }
        )
    }

    function ephemeralStateBackend() {
        const dirPath = `${__dirname}/test-${randomUUID()}`
        beforeEach(() => fs.mkdirSync(dirPath))
        afterEach(() => fs.rmSync(dirPath, { recursive: true, force: true }))
        return `file://${dirPath}`
    }
})

