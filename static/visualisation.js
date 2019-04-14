function createClusterGraph(relevantSentences, feature){
     // Create the input graph
     var g = new dagreD3.graphlib.Graph({compound:true})
     .setGraph({edgesep: 20, ranksep: 200, nodesep:10, rankdir: 'RL'})
     .setDefaultEdgeLabel(function() { return {}; });
 
  
     // Here we're setting the nodes
 
     g.setNode('requirementAnalysisGroup', {label: 'Requirement Analysis', clusterLabelPos: 'top', style: 'fill: #d3d7e8'});
     g.setNode('featureGroup', {label: 'Feature', clusterLabelPos: 'top', style: 'fill: #ffd47f'});
     g.setNode('funcReqGroup', {label: 'Functional requirements', clusterLabelPos: 'top', style: 'fill: #5f9488'});
     g.setNode('useCasesGroup', {label: 'Use cases', clusterLabelPos: 'top', style: 'fill: #5f9488'});
 
 
     g.setNode(feature, {label: feature})
     g.setParent(feature, 'requirementAnalysisGroup')
 
     //Set the feature node
     g.setNode(feature, {label: feature})
     g.setParent(feature, 'featureGroup')
 
     //build nodes and parent-child connections for all sentences
     for(let sentence of relevantSentences){
 
       g.setNode(sentence['sentence'], {label:sentence["sentence"]})
 
       if(sentence['type'] == "http://www.semanticweb.org/masterThesisOntology#FunctionalRequirementAndBehaviour"){
         g.setParent(sentence['sentence'],'funcReqGroup')
         g.setEdge(sentence['sentence'], feature, {label: 'BelongsTo'})
       }
       else if(sentence['type'] == "http://www.semanticweb.org/masterThesisOntology#UseCase") {
         g.setParent(sentence['sentence'],'useCasesGroup')
         g.setEdge(sentence['sentence'], feature, {label: 'BelongsTo'})
       }
       //{sentence: "Empty list message:", type: "http://www.semanticweb.org/masterThesisOntology#FunctionalRequirementAndBehaviour"}
     }
 
     // Set the parents to define which nodes belong to which cluster
     g.setParent('featureGroup', 'requirementAnalysisGroup');
     g.setParent('funcReqGroup', 'requirementAnalysisGroup');
     g.setParent('useCasesGroup', 'requirementAnalysisGroup');
 
 
 
     g.nodes().forEach(function(v) {
     var node = g.node(v);
     // Round the corners of the nodes
     node.rx = node.ry = 5;
     });
 
 
     // Create the renderer
     var render = new dagreD3.render();
 
     // Set up an SVG group so that we can translate the final graph.
     var svg = d3.select("#interactive_diagram_svg").append("svg"),
       svgGroup = svg.append("g");
 
     // Run the renderer. This is what draws the final graph.
     render(d3.select("svg g"), g);
     
}


function createTreeVisualisation (data){
  var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 2000 - margin.right - margin.left,
    height = 2000 - margin.top - margin.bottom;
    
  var i = 0,
    duration = 750,
    root;

  var tree = d3.layout.tree()
    .size([height, width]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

  var svg = d3.select(".second-column").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  root = data;
  root.x0 = height / 2;
  root.y0 = 0;
    
  update(root);

  d3.select(self.frameElement).style("height", "500px");



  function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

    nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
      .attr("r", 10)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; })

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#ADADAD")
      .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0};
      return diagonal({source: o, target: o});
      });


    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
      var o = {x: source.x, y: source.y};
      return diagonal({source: o, target: o});
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
    });

    node.each(function(d){
      if (d.name == "root") 
          d3.select(this).remove();});
    link.each(function(d){
      if (d.source.name == "root") 
          d3.select(this).remove();});
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
    d._children = d.children;
    d.children = null;
    } else {
    d.children = d._children;
    d._children = null;
    }
    update(d);
  }
}