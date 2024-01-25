import env from 'dotenv';

class Config {
  _config: Record<string, any>;
  constructor() {
    env.config();
    this._config = {
      port: process.env.PORT || 4000,
      dbUrl: process.env.DB_URL || '',
      saltRounds: process.env.SALT_ROUNDS || 10,
      privateKey: process.env.PRIVATE_KEY || 'someday123%',
      accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '30d',
    };
  }

  get(key: string): any {
    const val: any = this._config[key] ?? null;

    if (!val) {
      throw new Error(`Config for key [${key}] not found`);
    }

    return val;
  }
  set(key: string, val: any): void {
    this._config[key] = val;
  }
}

const config = new Config();

export default config;
