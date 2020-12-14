const fs = require("fs");
const parse = require('csv-parse/lib/sync');

const readEdges = (file) => {
    const text = fs.readFileSync(file);
    const csv_text = text.toString();
    return parse(csv_text, {
        columns:["status","node","button","from","to","value","direction","speed"],
        skip_empty_lines: true
    });
};

const getPoints = (edges) => {
    let results = {};
    let pointsHash = {};
    for ( let edge of edges ) {
        pointsHash[edge.from] = true;
        pointsHash[edge.to] = true;
    }
    for ( let pointName in pointsHash ) {
        results[pointName] = { 
            name: pointName,
            visited: false,
            value: Number.MAX_SAFE_INTEGER,
        };
    }
    return results;
}

const getInitPoints = (startPointName, points) => {
    let results = JSON.parse (JSON.stringify (points)); // clone
    console.log(points);
    results[startPointName].value = 0;
    return results;
}

const makeGraph = (edges) => {
    let result = {};
    for (let {from,to,value} of edges) {
        const valueInt = parseInt (value);
        addEdge (result, from, to,valueInt);
        addEdge (result, to, from, valueInt);
    }
    return result;
};

const addEdge = (graph, from,to,value) => {
    let fromNode = graph[from];
    if (fromNode) {
        fromNode[to] = value;
    } else {
        graph[from] = {[to]: value};
    }
};

const getShortestPath =  (startPointName, endPointName, points, graph) => {
    const visitingPoints = getInitPoints (startPointName, points);
    let next = visitingPoints[startPointName];
    while (next) {
        visit (next, visitingPoints, graph);
        next = getNextPoint (visitingPoints);
    }
    return collectPath(startPointName, endPointName, visitingPoints);
}

const    visit = (point,visitingPoints, graph) => {
    const nexts = graph[point.name];
    for ( let nextPointName in nexts ) {
        let value = nexts[nextPointName] + point.value;
        let nextPoint = visitingPoints[nextPointName];
        if ( nextPoint.value >  value) {
            nextPoint.value = value;
            nextPoint.path = point.name;
        }
    }
    point.visited = true;
};

const getNextPoint = (points) => {
    let result = null;
    for (let point of Object.values(points)) {
        if (!point.visited ) {
            if (!result || result.value > point.value) {
                result = point;
            }
        }
    }
    return result;
};

const collectPath = (startPointName, endPointName, points) => {
    let path = [];
    let point = points[endPointName];
    let value = point.value;
    while (point.name !== startPointName) {
        path.unshift (point.name);
        point = points[point.path];
    }
    path.unshift (startPointName);
    return {path,value};
}

const edges = readEdges ('Route.csv');

//console.log (edges);
// console.log ('=============');
// console.log (graph);
// console.log ('=============');
//console.log (getShortestPath ("22","94",points, graph));
// console.log (getShortestPath ('H','A',points, graph));
// console.log (getShortestPath ('H','C',points, graph));
// console.log (getShortestPath ('H','E',points, graph));
// console.log ('=============');
// console.log (getShortestPath ('O','E',points, graph));
// console.log (getShortestPath ('O','C',points, graph));
// console.log (getShortestPath ('O','A',points, graph));
// console.log (getShortestPath ('O','H',points, graph));


//console.log (shotestPathToD);
//console.log (points);
//console.log (edges);
//console.log (graph);
module.exports = {
    readEdges: readEdges,
    makeGraph: makeGraph,
    getPoints: getPoints,
    getShortestPath: getShortestPath
  };