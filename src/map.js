var width = 960, height = 600, h_transfer = 350, formatNumber = d3.format("s");

var projection = d3.geoAlbers()
    			   .center([0, 46.2276])
				   .rotate([-2.2137,0])
    			   .scale(2800)
    			   .translate([width/2, h_transfer]);

var path = d3.geoPath()
             .projection(projection);

var svg = d3.select("body")
			.append("div")
			.attr("id", "my_dataviz");
	
var svg= svg.append("svg")
    		.attr("width", width)
    		.attr("height", height);

svg.append("text")
   .text("Museum Explorer")
   .attr("x", width/2-80)
   .attr("y", 50)
   .attr("class", "title");
	
d3.json("france.json").then(function(france){
	var regions = svg.selectAll(".regions")
       				 .data(topojson.feature(france, france.objects.regions).features)
      				 .enter()
				  	 .append("path")
      				 .attr("class", "regions")
     				 .attr("d", path)
      				 .style("fill","white" );

	svg.append("path")
       .datum(topojson.mesh(france, france.objects.regions, function(a, b) { 
			   													return a.properties.name !== b.properties.name || a === b; 
	   														 }))
       .attr("class","border")
       .attr("d", path)
       .style("fill", "none")
       .style("stroke", "#333")
       .style("stroke-width", "0.5");

	// create a tooltip
	var Tooltip = d3.select("#my_dataviz")
      				.append("div")
      				.attr("class", "tooltip")
      				.style("opacity", 0.9)
      				.style("background-color", "rgba(255,255,255,0.7)");

    var mouseover = function(event, d,i ){
     							Tooltip.style("opacity", 1) 
								var x =  parseInt(d3.select(this).attr("cx"))+110 
								var y =  parseInt(d3.select(this).attr("cy"))+10
    							Tooltip.html(d.museum+" (" + d.name+")")
      						   		   .style("left", x+"px")
      						   		   .style("top", y+"px")
    							};
    var mouseleave = function(d) { Tooltip.style("opacity", 0) };


	var museums = [ "Condé Museum", "Louvre Museum", "Museum of Fine Arts of Lyon", "Musée des Augustins", 
					"Musée des Beaux-Arts de Bordeaux", "Musée des Beaux-Arts de Rouen", 
					"Palais des Beaux-Arts de Lille" ]

	var cities = ["Chantilly", "Paris", "Lyon", "Toulouse", "Bordeaux", "Rouen" , "Lille"]


    var markers = [ {long: 0.58, lat:44.84, name: "Chantilly", museum: "Condé Museum"}, 
                  	{long: 2.28, lat:49.19, name: "Paris", museum: "Louvre Museum"},  
                  	{long: 3.07, lat: 50.64, name: "Lyon", museum: "Museum of Fine Arts of Lyon"}, 
                  	{long: 4.84, lat: 45.76, name: "Toulouse", museum: "Musée des Augustins"},  
                  	{long: 2.349, lat: 48.864, name: "Bordeaux", museum:"Musée des Beaux-Arts de Bordeaux"}, 
                  	{long: 1.1, lat: 49.44, name: "Rouen", museum: "Musée des Beaux-Arts de Rouen"},  
                  	{long: 1.44, lat: 43.60, name: "Lille", museum:"Palais des Beaux-Arts de Lille" } 
                 ];
	var colors = ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494'] 

	cluster_color = d3.scaleOrdinal()
		  			  .domain(cities)
		  			  .range(colors);

	svg.selectAll("myCircles")
       .data(markers)
       .enter()
       .append("circle")
       .attr("cx", function(d){return projection([d.long, d.lat])[0] })
       .attr("cy", function(d){ return projection([d.long, d.lat])[1] })
       .attr("r", 7)
       .attr("class", "circle")
	   .style("fill", function(d) {return cluster_color(d.name)})
	   .style("stroke", function(d) {return cluster_color(d.name)})
       .attr("stroke-width", 3)
       .attr("fill-opacity", .4)
       .on("mouseover", mouseover)
       .on("mousemove", mouseover)
       .on("mouseout", mouseleave)
	   .on("click", function(d,object) {
    					var params = "?museum="+object.museum
   			 			window.open("gallery.html"+params, "_self")
					});
 });

