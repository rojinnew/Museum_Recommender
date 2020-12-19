const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const selected_id = urlParams.get("id")

var left = d3.select(".left")
			 .select("img")
		     .attr("src","./gallery/"+ selected_id+ "_0.jpg") 

var right = d3.select(".right")

let margin = {top: 100, right: 100, bottom: 100, left: 100};

let width = 450, height = 400,
    		padding = 1.5, // separation between same-color circles
    		clusterPadding = 6, // separation between different-color circles
    		maxRadius = 30;

let n = 200, // total number of nodes
    m = 10, // number of distinct clusters
	museums = [ "Condé Museum", "Louvre Museum", "Museum of Fine Arts of Lyon", "Musée des Augustins", 
				"Musée des Beaux-Arts de Bordeaux", "Musée des Beaux-Arts de Rouen", 
				"Palais des Beaux-Arts de Lille"],
	colors = ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494"] 
	colors_rgb = ["rgb(102,194,165,0.3)","rgb(252,141,98,0.3)","rgb(141,160,203,0.3)","rgb(231,138,195,0.3)","rgb(166,216,84,0.3)","rgb(255,217,47,0.3)","rgb(229,196,148,0.3)"];

cluster_color = d3.scaleOrdinal()
	  			  .domain(museums)
	  			  .range(colors);

cluster_color_light = d3.scaleOrdinal()
	  			  .domain(museums)
	  			  .range(colors_rgb);

clusters = new Array(m);

let svg_middle = d3.select(".middle")
   				   .append("svg")
				   .style("fill-opacity", "0.9")
				   .style("stroke", "#fff")
				   .style("stroke-width", "0.5")
				   .style("stroke-opacity", "0.6")
				   .style("background-color", "transparent")
   				   .attr("height", height)
   				   .attr("width", width)
   				   .append("g")
				   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

d3.csv("combined_similarity.csv", function(input){
	d = input.filter(function(row) {
        return row["painting1"] == selected_id;
	});
var current_museum =  d[0].museum1;

// Add one dot in the legend for each name.
svg_middle.selectAll("legend-dots")
  	      .data(museums)
  		  .enter()
  		  .append("circle")
		  .attr("class", "legend-dots")
    	  .attr("cx", function(d,i){ return  -width/2+145+(i)*20})
    	  .attr("cy", function(d,i){ return -height/2+25}) 
    	  .attr("r", function(d) {if (d==current_museum) return 9; else return 7;})
    	  .attr("stroke-width", function(d) {if (d==current_museum) return "5px";})
    	  .style("fill", function(d){ return cluster_color(d)})
      	  .on("mouseover", function(event,d,i) {
		 					svg_middle.append("text")
				   					  .attr("class", "legend-dots-txt")
    			   					  .attr("x",function(d){
						   				  return  -width/2 
				   						})
    			   					  .attr("y", -height/2+50) 
    			   					  .attr("font-size", "12px") 
            	   					  .text(function(d){return event;})
    			   					  .text(function(d){
									  			if(event==current_museum) 
								   					return current_museum.concat("(original favoriate artwork)");
						   			  			else{ var out =  "an artwork in".concat(event) 
													return out;  
									  			};
				   					 		})
svg_middle.append("text")
		   .attr("class", "legend-dots-txt")
   		   .attr("font-size", "10px") 
   		   .attr("x",function(d){ return  -width/2})
   		   .attr("y", -height/2+65) 
           .text("circle's size reprsents similarty degree of correponding artwork to favorite artwork")
            })          
      		.on("mouseout", function(d) {
		 			svg_middle.selectAll(".legend-dots-txt").remove();
    		});

// Define the div for the tooltip
let div = d3.select("body")
			.append("div") 
   			.attr("class", "tooltip")       
			.style("background-color", "transparent")
   			.style("border", "none")
    		.style("border-width", "2px")
      		.style("border-radius", "5px")
      		.style("padding", "5px")
  			.style("display", "inline")
  			.style("position", "fixed")

let radiusScale = d3.scaleLinear()
   					.domain(d3.extent(d, function(d) { return +d.total_score;} ))
    				.range([4, maxRadius]);


let nodes = d.map((d) => {
    		// scale radius to fit on the screen
    		let scaledRadius  = radiusScale(+d.total_score),
			forcedCluster = d.museum2, 
			title = d.artworkLabel,
			title1 = d.artworkLabel1,
			creator = d.creatorLabel,
			creator1 = d.creatorLabel1,
			movement = d.movementLabel,
			movement1 = d.movementLabel1,
			genre = d.genreLabel,
			genre1 = d.genreLabel1,
			material = d.materialLabel,
			material1 = d.materialLabel1,
			inception = d.inceptionLabel,
			inception1 = d.inceptionLabel1,
			depict = d.depictLabel,
			depict1 = d.depictLabel1,
			painting1 = d.painting1,
			painting2 = d.painting2,
			imageSelector =  d.painting2+"_0", 
			imageSelector1 =  d.painting1+"_0", 
			depict_score = +d.depict_score,
			movement_score =+d.movement_score,
			genre_score = +d.genre_score,
			material_score = +d.material_score,
			inception_score = +d.inception_score,
			artist_score = +d.creator_score

    	// add cluster id and radius to array
    	d = {
      		cluster: forcedCluster,
      		r: scaledRadius,
			title: title,
			title1: d.title1,
			artist: creator,
			artist1: creator1,
			id: painting1,
			painting1: d.painting1,
			painting2: d.painting2,
			image: imageSelector,
			image1: imageSelector1,
			depict: depict,
			depict1: depict1,
			movement: movement,
			movement1: movement1,
			material: material,
			material1: material1,
			genre: genre,
			genre1: genre1,
			inception: inception, 
			inception1: inception1, 
			depict_score: depict_score,
			movement_score: movement_score,
			genre_score: genre_score,
			material_score: material_score,
			inception_score: inception_score,
			artist_score: artist_score
    	};
    	// add to clusters array if it doesn"t exist or the radius is larger than another radius in the cluster
    	if (!clusters[forcedCluster] || (scaledRadius > clusters[forcedCluster].r)) clusters[forcedCluster] = d;

    	return d;
  	});


  	// append the circles to svg then style
  	// add functions for interaction
  	let circles = svg_middle.append("g")
        			.datum(nodes)
					.selectAll(".circle")
					.data(d => d)
					//.filter(function(d) { return d.painting1 == selected_id })
      				.enter().append("circle")
        			.attr("r", (d) => d.r)
					.attr("fill", function(d){  
						return cluster_color(d.cluster)})
        			.attr("stroke-width", 1)
        			.call(d3.drag()
           			.on("start", dragstarted)
            		.on("drag", dragged)
            		.on("end", dragended))
        			.on("mouseover", function(d,index) {
	        			d3.select(this).style("cursor", "pointer");
	        			div.transition()
                		.duration(200)
                		.style("opacity", 1);
		
					div.html(d.cluster)	
				   	   .style("font-family", "Roboto Slab,Montserrat,Roboto,Helvetica,sans-serif")
				   	   .style("font-size", "12px")
                	   .style("left", (d3.event.pageX-40) + "px")
                	   .style("top", (d3.event.pageY - 10) + "px");

        })
        .on("mouseout", function(d) {       
            div.transition()        
               .duration(500)      
               .style("opacity", 0)   
          })          
       	.on("click", function(d, index) {   
			circles.attr("stroke-width", 1)
			d3.select(this)
			  .attr("stroke-width", 10)
			  on_mouse_over(d)
		})

  // create the clustering/collision force simulation
  let simulation = d3.forceSimulation(nodes)
      .velocityDecay(0.2)
      .force("x", d3.forceX().strength(.0005))
      .force("y", d3.forceY().strength(.005))
      .force("collide", collide)
      .force("cluster", clustering)
      .on("tick", ticked);

  function ticked() {
      circles
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y);
  }
  // Drag functions used for interactivity
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // These are implementations of the custom forces.
  function clustering(alpha) {
      nodes.forEach(function(d) {
        var cluster = clusters[d.cluster];
        if (cluster === d) return;
        var x = d.x - cluster.x,
            y = d.y - cluster.y,
            l = Math.sqrt(x * x + y * y),
            r = d.r + cluster.r;
        if (l !== r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
        }
      });
  }

  function collide(alpha) {
    var quadtree = d3.quadtree()
        .x((d) => d.x)
        .y((d) => d.y)
        .addAll(nodes);

    nodes.forEach(function(d) {
      var r = d.r + maxRadius + Math.max(padding, clusterPadding),
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
      quadtree.visit(function(quad, x1, y1, x2, y2) {

        if (quad.data && (quad.data !== d)) {
          var x = d.x - quad.data.x,
              y = d.y - quad.data.y,
              l = Math.sqrt(x * x + y * y),
              r = d.r + quad.data.r + (d.cluster === quad.data.cluster ? padding : clusterPadding);
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.data.x += x;
            quad.data.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    });
  }

  console.log("selected_id",selected_id)
  var element = d.filter(e => e.painting1 === selected_id)[0];
  console.log("element",element)

  details_left = d3.select(".left")
			  	   .append("div")
			       //.attr("class", "detail-left")
   			       .append("div")
		           .attr("class", "bio")

  details_left.append("h4")
	 		  .text("Title: ")
	 		  .append("span")
	 		  .text(element.artworkLabel1)		

  details_left.append("h4")
	 		  .text("Artist: ")
	 		  .append("span")
	 		  .text(element.creatorLabel1)		

  details_left.append("h4")
	 		  .text("Inception: ")
	 		  .append("span")
	 		  .text(element.inceptionLabel1)		

  details_left.append("h4")
	 		  .text("Genre: ")
	 		  .append("span")
	 		  .text(element.genreLabel1)		

  details_left.append("h4")
	 		  .text("Movement: ")
	 		  .append("span")
	 		  .text(element.movementLabel1)
	 
details_left.append("h4")
	 		.text("Material: ")
	 		.append("span")
	 		.text(element.materialLabel1)	

details_left.append("h4")
	 		.text("Depict: ")
	 		.append("span")
	 		.text(element.depictLabel1)	
//var selected_color = colors_rgb[museums.indexOf(element.museum1)]
details_left.append("h4")
	 		.text("Museum: ")
	 		.append("span")
	 		.text(element.museum1)
        	.style("background-color", cluster_color_light(element.museum1))


console.log(element)
var right = d3.select(".right")
	 		  .select("img")
			  .attr("src", "/gallery/" + element.painting2+"_0.jpg")

details_right = d3.select(".right")
	              .append("div")
                  .attr("class", "detail-right")
	              .append("div")
                  .attr("class", "bio")

details_right.append("h4")
		     .text("Title: ")
			 .append("span")
			 .text(element.artworkLabel)		

details_right.append("h4")
			 .text("Artist: ")
			 .append("span")
			 .text(element.creatorLabel)		

details_right.append("h4")
			 .text("Inception: ")
			 .append("span")
			 .text(element.inceptionLabel)		

details_right.append("h4")
			 .text("Genre: ")
			 .append("span")
			 .text(element.genreLabel)		

details_right.append("h4")
			 .text("Movement: ")
			 .append("span")
			 .text(element.movementLabel)


details_right.append("h4")
		     .text("Material: ")
			 .append("span")
			 .text(element.materialLabel)	

details_right.append("h4")
			 .text("Depict: ")
			 .append("span")
			 .text(element.depictLabel)	


details_right.append("h4")
	 		.text("Museum: ")
	 		.append("span")
	 		.text(element.museum2)	
	 		.style("background-color", cluster_color_light(element.museum2))

function on_mouse_over(d) {
	var right = d3.select(".right")
			 	  .select("img")
				  .attr("src", "/gallery/" + d.image+".jpg")

	if (d.artist_score != 0){
				details_middle.select("#artist")
							  .classed("button", false) 
							  .classed("button-selected", true)
	}
	else{
				details_middle.select("#artist")
							  .classed("button-selected", false)
							  .classed("button", true) 

	}

	if (d.genre_score != 0){
				details_middle.select("#genre")
							  .classed("button", false) 
							  .classed("button-selected", true)
	}
	else{
				details_middle.select("#genre")
							  .classed("button-selected", false)
							  .classed("button", true) 

	}

	if (d.inception_score != 0){
				details_middle.select("#inception")
							  .classed("button", false) 
							  .classed("button-selected", true)
	}
	else{
				details_middle.select("#inception")
							  .classed("button-selected", false)
							  .classed("button", true) 

	}


			if (d.movement_score != 0){
				details_middle.select("#movement")
							  .classed("button", false) 
							  .classed("button-selected", true)
			}
			else{
				details_middle.select("#movement")
							  .classed("button-selected", false)
							  .classed("button", true) 

			}



			if (d.depict_score !=0){
				details_middle.select("#topic")
							  .classed("button", false) 
							  .classed("button-selected", true)
			}
			else{
				details_middle.select("#topic")
							  .classed("button-selected", false)
							  .classed("button", true) 

			}

  details_right = d3.select(".detail-right").remove();
  details_right = d3.select(".right")
			  .append("div")
			  .attr("class", "detail-right")
   			  .append("div")
		      .attr("class", "bio")

  details_right.append("h4")
	 		  .text("Title: ")
	 		  .append("span")
	 		  .text(d.title)		

  details_right.append("h4")
	 .text("Inception: ")
	 .append("span")
	 .text(d.inception)		

  details_right.append("h4")
	 .text("Artist: ")
	 .append("span")
	 .text(d.artist)		

  details_right.append("h4")
	 .text("Genre: ")
	 .append("span")
	 .text(d.genre)		

  details_right.append("h4")
	 .text("Movement: ")
	 .append("span")
	 .text(d.movement)	
	 
  details_right.append("h4")
	 .text("Materials: ")
	 .append("span")
	 .text(d.material)

  details_right.append("h4")
	 .text("Depict: ")
	 .append("span")
	 .text(d.depict)	

 details_right.append("h4")
	 		.text("Museum: ")
	 		.append("span")
	 		.text(d.cluster)	
            .style("background-color", cluster_color_light(d.cluster))
 }
	 
  details_middle = d3.select(".middle")
			  		 .append("div")
		      		 .attr("class", "toggle")
		      		 .attr("class", "bio")

  details_middle.append("input")
      			.attr("type", "button")
		      	.attr("class", "button-all")
      			.attr("name", "Artist")
				.attr("value", "Artist")
				.attr("id", "artist")

  details_middle.append("input")
      			.attr("type", "button")
		      	.attr("class", "button-all")
      			.attr("name", "Inception")
				.attr("value", "Inception")
				.attr("id", "inception")

  details_middle.append("input")
      			.attr("type", "button")
		      	.attr("class", "button-all")
      			.attr("name", "Genre")
      			.attr("value", "Genre")
				.attr("id", "genre")

  details_middle.append("input")
      			.attr("type", "button")
		      	.attr("class", "button-all")
      			.attr("name", "Movement")
				.attr("value", "Movement")
				.attr("id", "movement")

  details_middle.append("input")
      			.attr("type", "button")
      			.attr("name", "material")
		      	.attr("class", "button-all")
				.attr("value", "Material")
				.attr("id", "material")

  details_middle.append("input")
      			.attr("type", "button")
      			.attr("name", "topic")
		      	.attr("class", "button-all")
				.attr("value", "Topic")
				.attr("id", "topic")

  function togglePressed(){
  	alert("You pressed the toggle button!");
 }



if (element.artist_score != 0){
	details_middle.select("#artist")
				  .classed("button", false) 
				  .classed("button-selected", true)
}
else{
	details_middle.select("#artist")
				  .classed("button-selected", false)
				  .classed("button", true) 

}

if (element.genre_score != 0){
	details_middle.select("#genre")
				  .classed("button", false) 
				  .classed("button-selected", true)
}
else{
	details_middle.select("#genre")
				  .classed("button-selected", false)
				  .classed("button", true) 

}

if (element.inception_score != 0){
	details_middle.select("#inception")
				  .classed("button", false) 
				  .classed("button-selected", true)
}
else{
	details_middle.select("#inception")
				  .classed("button-selected", false)
				  .classed("button", true) 

}


if (element.movement_score != 0){
	details_middle.select("#movement")
				  .classed("button", false) 
				  .classed("button-selected", true)
}
else{
	details_middle.select("#movement")
				  .classed("button-selected", false)
				  .classed("button", true) 

}

if (element.depict_score !=0){
	details_middle.select("#topic")
				  .classed("button", false) 
				  .classed("button-selected", true)
}
else{
	details_middle.select("#topic")
				  .classed("button-selected", false)
				  .classed("button", true) 
}

if (element.material_score !=0){
	details_middle.select("#material")
				  .classed("button", false) 
				  .classed("button-selected", true)
}
else{
	details_middle.select("#material")
				  .classed("button-selected", false)
				  .classed("button", true) 
}
});
