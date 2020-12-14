const findRoute = require("../findRoute.js");
const assert = require('assert');
const edges = findRoute.readEdges('Route.csv');
const graph = findRoute.makeGraph(edges);
const points   = findRoute.getPoints (edges);
describe('test log value', () => {
    it('test log value', () => {
     const result = findRoute.getShortestPath("22", "15", points, graph )
     assert.strictEqual(result.value, 138670);
     assert.strictEqual(result.path.join(" "), "22 69 49 50 51 55 56 15");
    });
 
});