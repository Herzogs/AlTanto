import { Dialect } from "sequelize";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string
            DB_PORT: string
            DB_USER: string
            DB_PASSWORD: string
            DB_HOST: string
            BD_NAME_DATABASE: string
            DB_DIALECT: Dialect
            CREATE_TABLE: string
            JWT_SECRET: string
            USER_POOL_ID: string
            CLIENT_ID: string
            AWS_REGION: string
            CRON_TIME: string
            CRON_TIME_TEST: string
            GOOGLE_TRANSLATE_API_KEY: string
            CV_ENDPOINT: string
            CV_KEY: string
            CORS_ORIGIN: string
            DB_SSL_CA: string
        }
    }
}
export { }