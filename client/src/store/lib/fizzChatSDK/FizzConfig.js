// exports
export default class FizzConfig {
  constructor() {
    this.props = {
      appId: process.env.FIZZ_APP_ID,
      userId: process.env.FIZZ_USER_ID,
      appSecret: process.env.FIZZ_APP_SECRET
    };
  }

  update(updates) {
    Object.keys(updates).forEach((key) => {
      if (!this.props.hasOwnProperty(key)) {
        console.log('Invalid Config Key: ', key);
        return;
      }
      this.props[key] = updates[key];
    });
  }
}