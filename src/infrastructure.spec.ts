import { UpResult } from "@pulumi/pulumi/automation"
import { infrastructure } from "./infrastructure"
import { deployToLocalstack, ephemeralLocalstack, ephemeralStateBackend } from "./test-utils"

describe("Infrastructure", () => {
    const resolveLocalstackEndpoint = ephemeralLocalstack()
    const stateBackend = ephemeralStateBackend()
    const testTimeout = 120_000
    let deployment: UpResult

    beforeAll(async () => {
        deployment = await deployToLocalstack(
            infrastructure,
            stateBackend,
            await resolveLocalstackEndpoint()
        )
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

})


