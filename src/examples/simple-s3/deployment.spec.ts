import { UpResult } from "@pulumi/pulumi/automation"
import { resources } from "./resources"
import { deployToLocalstack, ephemeralLocalstack, ephemeralStateBackend } from "../../test-utils"

describe("Simple creation of an S3 bucket", () => {
    const resolveLocalstackEndpoint = ephemeralLocalstack()
    const stateBackend = ephemeralStateBackend()
    const testTimeout = 120_000
    let deployment: UpResult

    beforeAll(async () => {
        deployment = await deployToLocalstack(
            resources,
            stateBackend,
            await resolveLocalstackEndpoint()
        )
    }, testTimeout)

    it("creates an s3 bucket successfully", () => {
        expectResultToContain("Bucket my-bucket created")
    })

    function expectResultToContain(message: string) {
        expect(deployment.stdout).toContain(message)
    }

})


