import * as aws from "@pulumi/aws"

export const resources = async () => {
    new aws.s3.Bucket("my-bucket")
}
