/*
 * Process
 */

const {
  arch,
  argv,
  cpuUsage,
  env: {
    LANG,
    TERM_PROGRAM,
  },
  memoryUsage,
  moduleLoadList,
  version,
  versions: {
    v8
  },
  uptime
} = process;

/*
 * HttpApi
 */

const NodeExpressApi = require('node-express-api');

class HttpApi extends NodeExpressApi {
  static _200(res, body) {
    console.log(`\x1b[32m<< ${new Date().toString()} >> Sent (200 Response).\x1b[0m`);

    return res.status(200).json(body);
  }

  static _400(res) {
    console.log(`\x1b[31m<< ${new Date().toString()} >> Type mismatch (400 Response).\x1b[0m`);

    return res.status(400).send({
      error: {
        message: 'Type mismatch.',
        type: 'Bad Request'
      },
      status: 400
    });
  }

  static _404(res) {
    console.log(`\x1b[31m<< ${new Date().toString()} >> Action not found (404 Response).\x1b[0m`);

    return res.status(404).send({
      error: {
        message: 'Action not found.',
        type: 'Not Found'
      },
      status: 404
    });
  }

  static _500(res) {
    console.log(`\x1b[31m<< ${new Date().toString()} >> Uncaught error (500 Response).\x1b[0m`);

    res.status(500).send({
      error: {
        message: 'Uncaught error.',
        type: 'Server Error'
      },
      status: 500
    });
  }

  constructor(startMessage) {
    const options = {
      startMessage,
      redirectToHttps: true
    };

    const requests = [
      { type: 'delete', path: '*', handler: 'onDelete' },
      { type: 'get', path: '*', handler: 'onGet' },
      { type: 'post', path: '*', handler: 'onPut' },
      { type: 'put', path: '*', handler: 'onPut' }
    ];

    super(requests, options);
  }

  async onDelete(req, res) {
    const { body, params } = req;
    const path = params[0];
    const action = this.getAction(path);

    if (!action.path) {
      return HttpApi._404(res);
    }

    if (action.path.includes(':key')) {
      body.key = path.replace(action.path.replace(':key', ''), '');
    }

    const state = await this.willDelete(action, params, body);

    switch (state.status) {
      case 200:
        const result = await action.didDelete(body);

        return HttpApi._200(res, result || state);
      case 400:
        return HttpApi._400(res);
      case 404:
        return HttpApi._404(res);
      default:
        return HttpApi._500(res);
    }
  }

  async onGet(req, res) {
    const { body, params } = req;
    const path = params[0];
    const action = this.getAction(path);

    if (!action.path) {
      return HttpApi._404(res);
    }

    if (action.path.includes(':key')) {
      body.key = path.replace(action.path.replace(':key', ''), '');
    }

    const state = await this.willGet(action, params, body);

    switch (state.status) {
      case 200:
        const result = await action.didGet(body);

        return HttpApi._200(res, result || state);
      case 404:
        return HttpApi._404(res);
      default:
        return HttpApi._500(res);
    }
  }

  async onPut(req, res) {
    const body = req;
    const { params } = res.req;
    const path = params[0];
    const action = this.getAction(path);

    if (!action.path) {
      return HttpApi._404(res);
    }

    if (action.path.includes(':key')) {
      body.key = path.replace(action.path.replace(':key', ''), '');
    }

    const state = await this.willPut(action, params, body);

    switch (state.status) {
      case 200:
        const result = await action.didPut(body);

        return HttpApi._200(res, result || state);
      case 400:
        return HttpApi._400(res);
      case 404:
        return HttpApi._404(res);
      default:
        return HttpApi._500(res);
    }

    return false;
  }
}

exports.HttpApi = HttpApi;

/*
 * ƒ.Component
 */

const _getClassNameByInstance = instance => instance.constructor.prototype.constructor.name;

const _getConsoleMargin = () => ('<< ' + new Date().toString() + ' >>').split('').map(c => ' ').join('');

class Component {
  constructor() {
    const { actions } = this;

    this.actions = Array.isArray(actions) && actions.map(c => c.constructor.name === 'Action').length === actions.length ? actions : [];
    this.__state = { ...this.actions.map(r => r.state) };
  }

  get shape() {
    return this.__shape;
  }

  get state() {
    return Object.assign(this.__state, ...this.actions.map(r => r.state) || {});
  }

  getAction(path) {
    const isTopLevel = (path.match(/\//gi).length === 1);
    const p = isTopLevel ? path : path.split('/');
    const route = isTopLevel ? path : path.split(p[p.length - 1])[0];
    const routes = this.actions.map(a => a.path);
    const matchedRoutes = routes.filter(r => route.match(r.split(':')[0]));
    let action = this.actions.filter(a => a.path.split(':')[0] === route)[0];

    return action || {};
  }

  getStateByKey(key) {
    return Object.assign({}, ...Object.keys(this.state).map(k => ({
      [k]: this.state[k][key]
    })));
  }

  setActions(action) {
    if (Array.isArray(action)) {
      action.forEach(a => this.actions.push(a));
    }
    else {
      this.actions.push(action);
    }
  }

  setShape(shape) {
    const state = {};

    this.__shape = this.shape || {};

    Object.keys(shape).forEach(k => {
      this.__shape[k] = shape[k];
      state[k] = this.state.hasOwnProperty(k) ? this.state[k] : {};
    });

    this.setState(state);
  }

  async setState(state) {
    let isValidType = true;

    if (Object.keys(state).map(k => Object.keys(this.shape || {}).includes(k)).includes(false)) {
      console.log(`\x1b[31m<< ${new Date().toString()} >> ${'Property mismatch:\n ' + _getConsoleMargin() + ' Try using `setShape` before calling `setState`.'}\x1b[0m`);

      return false;
    }

    Object.keys(state).map(k => {
      const isKeyed = _getClassNameByInstance(this) !== 'Node' && this.path.includes(':');
      const key = (isKeyed && state[k][Object.keys(state[k])[0]]) || state[k];
      const actualType = _getClassNameByInstance(key);
      const expectedType = _getClassNameByInstance(this.shape[k]);

      if (JSON.stringify(state[k]) !== '{}' && actualType !== expectedType) {
        console.log(`\x1b[31m<< ${new Date().toString()} >> ${'Type mismatch for key "' + k + '":\n'} ${_getConsoleMargin()} Expected: ${expectedType}\n ${_getConsoleMargin()} Received: ${actualType}\n\x1b[0m`);
        isValidType = false;
      }
    });

    if (isValidType) {
      this.__state = Object.assign(Object.assign(this.state, state), ...this.actions.map(r => r.state) || {});

      const appState = Object.assign(ƒ.root.getNode().state || {}, this.__state);

      ƒ.root.getNode().__state = appState;

      if (ƒ.root.getNode().db) {
        try {
          const version = ƒ.root.getNode().state.dbVersion;
          const collection = await ƒ.root.getNode().db.collection('state');

          collection.updateOne(
            { version },
            { $set: { state: appState } }
          );

          console.log(`\x1b[32m<< ${new Date().toString()} >> Node state updated.\x1b[0m`);
        } catch (error) {
          console.log(`\x1b[31m<< ${new Date().toString()} >> Database error.\x1b[0m`);
          console.log(`\x1b[31m${error}\x1b[0m`);
        }
      }
    }

    return isValidType;
  }
}

/*
 * Fire (ƒ)
 */

const ƒ = {
  Action: class extends Component {
    constructor(path) {
      super();

      this.canDelete = true;
      this.canRead = true;
      this.canWrite = true;
      this.path = path || '/';
    }

    didDelete(params) {}

    didGet(params) {}

    didPut(params) {}

    setReadWriteDelete(canRead, canWrite, canDelete) {
      this.canDelete = arguments.length > 2 ? canDelete : this.canDelete;
      this.canRead = arguments.length > 0 ? canRead : this.canRead;
      this.canWrite = arguments.length > 1 ? canWrite : this.canWrite;
    }

    syncState() {
      Object.keys(this.shape).forEach(k => {
        this.state[k] = ƒ.root.getNode().__state[k];
      });
    }
  },
  Node: class extends Component {
    constructor() {
      super();

      const { version } = ƒ.system.node;
      const startMessage = `\x1b[32m<< ${new Date().toString()} >> Fire v${ƒ.version} is running on Node.js ${version} (V8 v${v8}).\x1b[0m`;
      const httpApi = new HttpApi(startMessage);

      if (ƒ.root.args.join('').match('--skip-db') == null) {
        const mongoClient = require('mongodb').MongoClient;
        const mongoOptions = {
          useNewUrlParser: true,
          useUnifiedTopology: true
        };

        mongoClient.connect('mongodb://localhost:27017', mongoOptions, (...args) => this.databaseDidConnect(...args));
      }
      else {
        console.log(`\x1b[33m<< ${new Date().toString()} >> With flags: "--skip-db"\x1b[0m`);
      }

      httpApi.onDelete = httpApi.onDelete.bind(this);
      httpApi.onGet = httpApi.onGet.bind(this);
      httpApi.onPut = httpApi.onPut.bind(this);

      ƒ.root.getNode = () => this;
    }

    get db() {
      return this.__db;
    }

    async databaseDidConnect(error, client) {
      const date = new Date().toString();

      if (error) {
        console.log(`\x1b[31m<< ${date} >> Database connection error.\x1b[0m`);
        console.log(`\x1b[31m${error}\x1b[0m`);

        return false;
      }

      this.__db = await client.db('firedb');

      console.log(`\x1b[32m<< ${date} >> MongoDB Node driver v${this.db.serverConfig.clientInfo.driver.version} is running on ${this.db.serverConfig.clientInfo.platform} (V8).\x1b[0m`);
      console.log(`\x1b[32m<< ${date} >> Connected to "${this.db.databaseName}".\x1b[0m`);
      ƒ.system.mongo.nodeVersion = this.db.serverConfig.clientInfo.platform;

      const { dbVersion } = this.state;
      const collection = await this.db.collection('state');
      const savedState = await collection.findOne({ version: dbVersion });

      if (!savedState) {
        console.log(`\x1b[33m<< ${date} >> Database exception. Failed to load a collection: "state". Creating one from scratch...\x1b[0m`);

        this.db.createCollection('state', async (err, res) => {
          if (err) {
            console.log(`\x1b[31m<< ${date} >> Database error. Failed to create a collection: "state".\x1b[0m`);
            console.log(`\x1b[31m${err}\x1b[0m`);

            return false;
          }

          console.log(`\x1b[32m<< ${date} >> Database updated. Created a collection: "state".\x1b[0m`);

          try {
            await res.insertOne({ version: dbVersion, state: this.state });
          } catch (e) {
            console.log(`\x1b[31m<< ${date} >> Database error. Failed to save data to collection: "state".\x1b[0m`);
            console.log(`\x1b[31m${e}\x1b[0m`);
          };

          client.close();
        });
      }
      else {
        if (Object.keys(savedState.state).join('') === Object.keys(this.state).join('')) {
          this.__state = savedState.state;
          this.actions.forEach(a => a.syncState());
        }
      }

      return await this.didLoad();
    }

    async didLoad() {
      const { dbVersion } = this.state;
      const collection = await this.db.collection('state');
      const documentCount = await collection.countDocuments();

      this.setState({ dbVersion: (Math.max(1, ((dbVersion << 0) || documentCount))).toString() });

      return this;
    }

    willDelete(action, params, body) {
      const path = params[0];

      if (action.canDelete) {
        const key = action.path.includes(':') && path.replace(action.path.split(':')[0], '').split('/')[0];
        const only = body.only || Object.keys(action.state);

        only.forEach(k => {
          if (key && action.state.hasOwnProperty(k) && action.state[k].hasOwnProperty(key)) {
            delete action.state[k][key];
          }
          else {
            if (action.state.hasOwnProperty(k)) {
              delete action.state[k];
            }
          }
        });

        return {
          status: 200
        };
      }

      return {
        status: 404
      };
    }

    willGet(action, params) {
      const path = params[0];

      if (action.canRead) {
        const key = action.path.includes(':') && path.replace(action.path.split(':')[0], '').split('/')[0];
        const state = {
          timestamp: Date.now()
        };

        Object.keys(action.state).forEach(k => {
          if (action.state[k]) {
            state[k] = key ? action.state[k][key] : action.state[k];
          }
        });

        return {
          ...state,

          status: 200
        };
      }

      return {
        status: 404
      };
    }

    willPut(action, params, body) {
      const path = params[0];

      if (action.canWrite) {
        const key = action.path.includes(':') && path.replace(action.path.split(':')[0], '').split('/')[0];
        const state = {};

        Object.keys(action.state).filter(s => body.hasOwnProperty(s)).forEach(k => {
          const currentValue = (key ? action.state[k][key] : action.state[k]);
          const newValue = Object.keys(body).length > 0 ? body[k] : currentValue;

          if (key) {
            state[k] = Object.assign({}, action.state[k]);
            state[k][key] = newValue;
          }
          else {
            state[k] = newValue;
          }
        });

        if (Object.keys(state).length > 0 && action.setState(Object.assign({}, ...Object.keys(state).map(k => ({ [k]: state[k] || {} }))))) {
          return {
            status: 200,
            timestamp: Date.now()
          };
        }

        return {
          status: 400
        };
      }

      return {
        status: 404
      };
    }
  },
  Type: {
    Array: new Array,
    Boolean: new Boolean,
    Float: parseFloat(Math.PI),
    Function: function() {},
    Integer: parseInt(1, 10),
    Null: null,
    Number: new Number,
    Object: new Object,
    Set: new Set,
    String: new String,
    Undefined: undefined
  },
  hardware: {
    architecture: arch,
    getCPUUsage: () => `${(cpuUsage().user / cpuUsage().system * 100) << 0}%`,
    getMemoryUsage: () => `${(memoryUsage().heapUsed / memoryUsage().heapTotal * 100) << 0}%`,
    getUptime: () => uptime()
  },
  root: {
    args: argv.slice(2),
    getNode: () => {},
    terminal: {
      name: TERM_PROGRAM
    }
  },
  system: {
    javascript: {
      engine: 'V8',
      version: v8
    },
    language: LANG,
    mongo: {
      nodeVersion: ''
    },
    node: {
      bindings: moduleLoadList.map(m => m.match('Binding') && m.replace(/Binding /gi, '')).filter(m => m),
      modules: moduleLoadList.map(m => m.match('NativeComponent') && m.replace(/NativeComponent /gi, '')).filter(m => m),
      version
    }
  },
  version: '1.1.7'
};

/*
 * Export & globalize
 */

exports.Fire = exports.ƒ = global.Fire = ƒ;
