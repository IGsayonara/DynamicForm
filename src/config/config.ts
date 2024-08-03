const configs = {
  minInputLimit: 1,
  maxInputLimit: 10,
  initialLength: 3,
  matchedInputColor: 'green',
};

type Configs = typeof configs;
type ConfigKey = keyof Configs;

class ConfigService {
  private configs = configs;

  public getConfig<T extends ConfigKey> (key: T): Configs[T] {
    return this.configs[key];
  }

  public getConfigs (): Configs {
    return this.configs;
  }
}

export default new ConfigService();
