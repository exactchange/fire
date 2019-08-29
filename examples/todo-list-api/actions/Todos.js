const { ƒ } = require('../../..');

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
        { title: 'Go to the gym', isComplete: false },
        { title: 'Finish work presentation', isComplete: false },
        { title: 'Day dream', isComplete: true }
      ]
    });
  }

  didDelete(params) {
    // do stuff after data was deleted
  }

  didGet(params) {
    console.log('A user retrieved todos.');
  }

  didPut(params) {
    // do stuff after data was saved
  }
}

exports.Todos = Todos;
