const smoke = require('./node_modules/fire-backend-test');
const { it } = smoke;

const skipTests = false;

const runTests = async () => {
  try {
    await it('pings the API',
      {
        url: 'http://localhost:1337/',
      },
      {
        message: '👍',
        status: 200
      }
    );

    await it('retrieves todos',
      {
        url: 'http://localhost:1337/todos'
      },
      {
        todos: [
          { title: 'Do stuff', userId: '123', isComplete: false },
          { title: 'Day dream', userId: '456', isComplete: true }
        ],
        status: 200
      }
    );
  } catch(error) {
    console.log(error.message);
    console.log('<< ERROR >>', error);
  }
};

(async() => {
  if (!skipTests) {

    await runTests();

    console.log('Tests completed.');
  }
})();
