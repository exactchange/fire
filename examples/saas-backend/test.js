const smoke = require('fire-backend-test');
const { it } = smoke;

const skipTests = false;

const runTests = async () => {
  try {
    await it('pings the API',
      {
        url: 'http://localhost:1337/'
      },
      {
        message: '👍',
        status: 200
      }
    );

    await it('retrieves the dashboard state',
      {
        url: 'http://localhost:1337/dashboard',
      },
      {
        tipOfTheDay: 'Press ESC to enter distraction-free mode.',
        status: 200
      }
    );

    await it('enables analytics for User #123',
      {
        url: 'http://localhost:1337/dashboard/analytics/enable/123',
        data: { isEnabled: true },
        method: 'put'
      },
      {
        status: 200
      }
    );

    await it('sets a name and age for User #123',
      {
        url: 'http://localhost:1337/user/123',
        data: { name: 'Jane', age: 24 },
        method: 'put'
      },
      {
        status: 200
      }
    );

    await it('sets a bio for User #123',
      {
        url: 'http://localhost:1337/user/123',
        data: { bio: 'Chillin 💚' },
        method: 'put'
      },
      {
        status: 200
      }
    );

    await it('deletes age and bio for User #123',
      {
        url: 'http://localhost:1337/user/123',
        data: { only: ['age', 'name'] },
        method: 'delete'
      },
      {
        status: 200
      }
    );

    await it('retrieves info for User #123',
      {
        url: 'http://localhost:1337/user/123'
      },
      {
        bio: 'Chillin 💚',
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
