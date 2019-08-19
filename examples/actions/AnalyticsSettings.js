const { ƒ } = require('../..');

/*
 * AnalyticsSettings
 */

class AnalyticsSettings extends ƒ.Action {
  constructor(path) {
    super(path);

    this.setShape({
      isEnabled: ƒ.Type.Boolean
    });
  }

  didPut(params) {
    if (params.isEnabled === true || params.isEnabled === false) {
      console.log(`${params.isEnabled ? 'Enabled' : 'Disabled'} analytics!`);
    }
  }
}

exports.AnalyticsSettings = AnalyticsSettings;
