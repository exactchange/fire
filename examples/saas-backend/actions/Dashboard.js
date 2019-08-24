const { ƒ } = require('../../..');
const { AnalyticsSettings } = require('./AnalyticsSettings');

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

    this.setReadWriteDelete(true, false, false);

    this.createAction(new AnalyticsSettings(`${path}/analytics/enable/:key`));
  }

  didGet(params) {
    console.log('A user retrieved the Dashboard state.');
  }
}

exports.Dashboard = Dashboard;
