const findRoute = require("../findRoute.js");
const assert = require('assert');
const edges = findRoute.readEdges('expects.csv');
const graph = findRoute.makeGraph(edges);
const points   = findRoute.getPoints (edges);
describe('test log value', () => {
    it('test log value', () => {
     const result = findRoute.getShortestPath("132", "67", points, graph )
     assert.equal(result.value, 143500);
    assert.equal(result.path.join(" "), "132 89 136 74 76 72 79 49 66 67");
    });
 
});
