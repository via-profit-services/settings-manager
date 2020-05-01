declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';

    PORT: string;

    GQL_ENDPOINT: string;
    GQL_SUBSCRIPTIONENDPOINT: string;
    GQL_USE_PLAYGROUND: boolean;
    GQL_USE_VOYAGER: boolean;

    DB_HOST: string;
    DB_USER: string;
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_TIMEZONE: string;
    DB_MIGRATIONS_DIRECTORY: string;
    DB_MIGRATIONS_TABLENAME: string;
    DB_MIGRATIONS_EXTENSION: 'js' | 'ts';
    DB_SEEDS_DIRECTORY: string;
    DB_SEEDS_EXTENSION: 'js' | 'ts';

    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;

    JWT_ALGORITHM:
    'HS256' | 'HS384' | 'HS512' |
    'RS256' | 'RS384' | 'RS512' |
    'ES256' | 'ES384' | 'ES512' |
    'PS256' | 'PS384' | 'PS512' |
    'none';
    JWT_ACCESSTOKENEXPIRESIN: string;
    JWT_REFRESHTOKENEXPIRESIN: string;
    JWT_ISSUER: string;
    JWT_PRIVATEKEY: string;
    JWT_PUBLICKEY: string;
    JWT_BLACKLIST: string;

    SSL_KEY: string;
    SSL_CERT: string;

    TIMEZONE: string;
  }
}