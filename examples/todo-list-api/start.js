/*
 * Instantiate
 */

const { ƒ } = require('../../');
const { Node } = require('./node');

const node = new Node();

node.setShape({ dbVersion: ƒ.Type.String });
ƒ.root.args.forEach(async a => await node.setState({ [a.split('=')[0]]: a.split('=')[1] }));
