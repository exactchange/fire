const { ƒ } = require('../..');

/*
 * User
 */

class User extends ƒ.Action {
  constructor(path) {
    super(path);

    this.setShape({
      age: ƒ.Type.Integer,
      name: ƒ.Type.String,
      bio: ƒ.Type.String
    });
  }

  didGet(params) {
    // do stuff after data was returned
  }

  didPut(params) {
    // do stuff after data was saved
  }
}

exports.User = User;
