const { ƒ } = require('../..');
const { AnalyticsSettings } = require('./AnalyticsSettings');
const { Todos } = require('./Todos');

/*
 * Dashboard
 */

class Dashboard extends ƒ.Action {
  constructor(path) {
    super(path);

    this.setShape({
      tipOfTheDay: ƒ.Type.String
    });

    this.setState({
      tipOfTheDay: 'Press ESC to enter distraction-free mode.'
    });

    this.setReadWriteDelete(true, false);

    this.createAction([
      new AnalyticsSettings(`${path}/analytics/enable/:key`),
      new Todos(`${path}/todos`)
    ]);
  }

  didGet(params) {
    console.log('Someone retrieved the Dashboard state.');
  }
}

exports.Dashboard = Dashboard;
