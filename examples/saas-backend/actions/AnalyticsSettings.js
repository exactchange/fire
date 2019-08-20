const { ƒ } = require('../../..');

/*
 * AnalyticsSettings
 */

class AnalyticsSettings extends ƒ.Action {
  constructor(path) {
    super(path);

    this.setShape({
      isEnabled: ƒ.Type.Boolean
    });

    this.setReadWriteDelete(true, true, false);
  }

  didPut(params) {
    if (params.isEnabled === true || params.isEnabled === false) {
      console.log(`A user ${params.isEnabled ? 'enabled' : 'disabled'} analytics.`);
    }
  }
}

exports.AnalyticsSettings = AnalyticsSettings;
