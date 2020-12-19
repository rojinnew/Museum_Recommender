var src = "./gallery/";
const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const selected_museum = urlParams.get("museum");

paintings = paintings.filter(function(key) {return key.locLabel == selected_museum});

var header = d3.select("body")
               .append("div")
			   .attr("class", "title")
			   .text("Click on Your Favorite Painting in "+ selected_museum);

var svg = d3.select("body")
            .append("div")
            .attr("class","grid-container")
            .attr("width", 800)
            .attr("height", 600);

items = svg.selectAll("div")
    		.data(paintings)
    		.enter()
    		.append("div")
			.attr("class", "item");

items.insert("p")
	 .style("opacity", 1)
	 .text(function(d){return d["artworkLabel"]})
	 .attr("class", "label");

pictures = svg.selectAll(".item")
   	.append("img")
   	.attr("class", "picture")
   	.attr("src", function(d) { 
		   var element = d["id"]+"_0.jpg"
		   var element_id = src.concat(element)
		   return element_id
	})
	.style("opacity", 1);

items.on("mouseover", function(d,object) {
    d3.selectAll(".item")
	  .classed("item-fade", function(d) { 
		if(d.id != object["id"])
			  return true 
		})
});
items.on("mouseout", function(d) {
	d3.selectAll(".item")
	  .classed("item-fade", false)
});
items.on("click", function(d,object) {
    var params = "?id="+object.id;
    window.open("cluster.html"+params, "_self")
});

