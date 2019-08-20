const { ƒ } = require('../../..');
const { Ping } = require('../actions/Ping');
const { Todos } = require('../actions/Todos');

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

    this.actions = [
      new Ping('/'),
      new Todos('/todos')
    ];
  }
}

exports.Node = Node;
