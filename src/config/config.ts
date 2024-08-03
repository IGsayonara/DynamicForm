const configs = {
  minInputLimit: 1,
  maxInputLimit: 10,
  initialLength: 3,
};

class configService {
  private configs = configs;

  public getConfig (key: keyof typeof this.configs) {
    return this.configs[key];
  }

  public getConfigs () {
    return this.configs;
  }
}

export default new configService();
