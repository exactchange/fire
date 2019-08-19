/*
 * Instantiate
 */

const { ƒ } = require('..');
const { Node } = require('./node');

const node = new Node();

ƒ.root.args.forEach(a => node.setState({ [a.split('=')[0]]: a.split('=')[1] }));
node.didLoad();
