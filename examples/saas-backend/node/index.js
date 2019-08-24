const { ƒ } = require('../../..');
const { Dashboard } = require('../actions/Dashboard');
const { Ping } = require('../actions/Ping');
const { User } = require('../actions/User');

/*
 * Node
 */

class Node extends ƒ.Node {
  constructor() {
    super();

    this.setShape({
      startedAt: ƒ.Type.Number
    });

    this.setState({
      startedAt: Date.now()
    });

    this.setActions([
      new Ping('/'),
      new Dashboard('/dashboard'),
      new User('/user/:key')
    ]);
  }
}

exports.Node = Node;
