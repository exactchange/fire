const { ƒ } = require('../../..');

/*
 * User
 */

class User extends ƒ.Action {
  constructor(path) {
    super(path);

    this.setShape({
      age: ƒ.Type.Integer,
      bio: ƒ.Type.String,
      name: ƒ.Type.String
    });
  }

  didDelete(params) {
    // do stuff after data was deleted
  }

  didGet(params) {
    // do stuff after data was retrieved
  }

  didPut(params) {
    // do stuff after data was saved
  }
}

exports.User = User;
