# Fire (ƒ) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/exactchange/fire/blob/master/LICENSE) [![npm version](https://img.shields.io/badge/npm-v1.0.1-brightgreen)](https://www.npmjs.com/package/fire-backend)

Fire is a library for backend JavaScript.

* **Declarative:** Fire makes it painless to create application backends. Design simple Actions for each route in your application, and Fire will efficiently merge your updates with the global application state and save just the right data to the database, retaining a single-source of truth at the application level. Declarative APIs make your requests and responses more predictable, simpler to understand, and easier to debug.

* **State-Based:** Build encapsulated Actions that manage their own state, then compose them to make complex APIs. Because the application state can be derived from the state of all Actions, there is no need to create a database schema, or set up an initial database – Fire generates the database, and maintains the state of it as Actions are fired.

* **Write Anywhere:** Fire doesn't make assumptions about your application's front-end, so you can develop new features in Fire with your existing front-end code. Fire can also be used along-side many other Fire Nodes in a service network, sharing state information while retaining a single source of truth.

Although Fire is not opinionated about front-end interfaces, for full-stack developers it's a great backend choice for React interfaces because it is written in a modern ES6 way, and adheres to the functional-state paradigm:

#### The Functional Loop

![Functional Loop](https://i.ibb.co/VtfvS8f/3-Fire-Loop-React-Server-DB.png)

#### Vanilla (client only)

![Vanilla Client](https://i.ibb.co/rkc2jcW/0-Fire-Loop-Vanilla-Client.png)

#### React (client only)

![React Client](https://i.ibb.co/YfJLgGw/1-Fire-Loop-React-Client.png)

#### React/Fire (no database)

![React Client Fire Server](https://i.ibb.co/gRdQZYt/2-Fire-Loop-React-Server.png)

#### React/Fire/Mongo

![Functional Loop](https://i.ibb.co/VtfvS8f/3-Fire-Loop-React-Server-DB.png)

## Installation

`npm install fire-backend`

## Documentation

Coming soon.

## Examples

Here: [/examples](https://github.com/exactchange/fire/tree/master/examples)

Here is a basic API example to get you started:

```
/*
 * Action for "/todos"
 */

class Todos extends ƒ.Action {
  constructor(path) {
    super(path);

    this.setShape({
      todos: ƒ.Type.Array
    });

    this.setState({
      todos: [
        { title: 'Do stuff', userId: '123', isComplete: false },
        { title: 'Day dream', userId: '456', isComplete: true }
      ]
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
```

```
/*
 * Node with one action
 */

class Node extends ƒ.Node {
  constructor() {
    super();

    this.actions = [
      new Todos('/todos')
    ];
  }
}
```

This example exposes an endpoint for "/todos", with some bootstrapped data. As the endpoint is used (via `GET`, `POST`, `PUT`, `DELETE`) the database structure will change accordingly, without the developer having to manage those database operations.

## Contributing

The main purpose of this repository is to continue to evolve Fire, making it faster and easier to use. Development of Fire happens in the open on GitHub, and I am grateful to the community for contributing bugfixes and improvements.

### License

Fire is [MIT licensed](./LICENSE).
