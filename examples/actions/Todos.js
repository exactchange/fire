const { ƒ } = require('../..');

/*
 * Todos
 */

class Todos extends ƒ.Action {
  constructor(path) {
    super(path);

    this.setShape({
      todos: ƒ.Type.Array
    });

    this.setState({
      todos: [
        { title: 'Do stuff', isComplete: false },
        { title: 'Day dream', isComplete: true }
      ]
    });

    this.setReadWriteDelete(true, false);
  }

  didGet(params) {
    console.log('Someone retrieved todos.');
  }
}

exports.Todos = Todos;
