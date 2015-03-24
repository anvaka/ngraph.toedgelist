var test = require('tap').test;
var toEdgesList = require('../');
var createGraph = require('ngraph.graph');

test('it saves graph into edge list', function(t) {
  var graph = createGraph();
  graph.addLink(1, 2);
  graph.addLink(1, 3);
  graph.addLink(2, 4);

  var edgeList = toEdgesList(graph);

  t.equals(edgeList.length, 3, 'edge list has all edges');

  t.ok(hasElement(edgeList, edge([1, 2])), '1 -> 2 is here');
  t.ok(hasElement(edgeList, edge([1, 3])), '1 -> 3 is here');
  t.ok(hasElement(edgeList, edge([2, 4])), '2 -> 4 is here');
  t.end();
});

test('it saves graph into edge list asString', function(t) {
  var graph = createGraph();
  graph.addLink(1, 2);
  graph.addLink(1, 3);
  graph.addLink(2, 4);

  var edgeList = toEdgesList.asString(graph);

  t.ok(typeof edgeList === 'string', 'edge stored as a string');

  t.ok(edgeList.indexOf('1\t2') >= 0, '1 -> 2 is here');
  t.ok(edgeList.indexOf('1\t3') >= 0, '1 -> 3 is here');
  t.ok(edgeList.indexOf('2\t4') >= 0, '2 -> 4 is here');
  t.end();
});

test('string form has comments', function(t) {
  var graph = createGraph();
  graph.addLink(1, 2);
  graph.addLink(1, 3);
  graph.addLink(2, 4);

  var edgeList = toEdgesList.asString(graph);

  t.ok(edgeList.indexOf('Nodes: 4') >= 0, 'nodes count is described');
  t.ok(edgeList.indexOf('Edges: 3') >= 0, 'edges count is described');
  t.end();
});

test('it saves graph into set', function(t) {
  var graph = createGraph();
  graph.addLink('c', 'c++');
  graph.addLink('c', 'js');
  graph.addLink('js', 'coffee');

  var set = toEdgesList.asSet(graph);
  var labels = set.labels;
  var edgeList = set.edgeList;

  t.ok(hasElement(edgeList, edge([labels.c, labels['c++']])), 'c->c++ is here');
  t.ok(hasElement(edgeList, edge([labels.c, labels.js])), 'c->js is here');
  t.ok(hasElement(edgeList, edge([labels.js, labels.coffee])), 'js->coffee is here');

  t.end();
});

function edge(e) {
  return function(x) {
    return x[0] === e[0] && x[1] === e[1];
  };
}

function hasElement(arr, predicate) {
  for (var i = 0; i < arr.length; ++i) {
    if (predicate(arr[i])) {
      return true;
    }
  }
}
