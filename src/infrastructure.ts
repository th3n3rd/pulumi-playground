import * as aws from "@pulumi/aws"

export const infrastructure = async () => {
    new aws.s3.Bucket("my-bucket")
}
