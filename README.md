# Food manager

A simple Nuxt app to keep track of calories and macronutrients.

## Environment variables

### MongoDB

| Variable          | Description               |
| ----------------- | ------------------------- |
| NUXT_MONGOOSE_URI | URI to connect to MongoDB |

## Object storage (S3)

| Variable             | Description                              |
| -------------------- | ---------------------------------------- |
| S3_ENDPOINT          | Endpoint of the object storage provider  |
| S3_PORT              | Port used by the object storage provider |
| S3_BUCKET            | S3 bucket name                           |
| S3_ACCESS_KEY_ID     | Access key ID for the bucket             |
| S3_SECRET_ACCESS_KEY | Access key secret for the bucket         |

## Authentication (OIDC)

| Variable                   | Description                            |
| -------------------------- | -------------------------------------- |
| NUXT_PUBLIC_OIDC_AUTHORITY | URL of the OIDC provider               |
| NUXT_PUBLIC_OIDC_CLIENT_ID | OIDC client ID                         |
| NUXT_PUBLIC_OIDC_AUDIENCE  | (Optional) Audience parameter for OIDC |
