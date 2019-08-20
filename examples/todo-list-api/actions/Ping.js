const { ƒ } = require('../../..');

/*
 * Ping
 */

class Ping extends ƒ.Action {
  constructor(path) {
    super(path);

    this.setShape({
      message: ƒ.Type.String
    });

    this.setState({
      message: '👍'
    });

    this.setReadWriteDelete(true, false, false);
  }

  didGet(params) {
    console.log(`Ping! Responded with ${this.state.message}`);
  }
}

exports.Ping = Ping;
