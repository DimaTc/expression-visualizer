const w = 550;
const h = 550;
const padding = 50;
let count = 0;
let scale = d3
  .scaleLinear()
  .domain([0, w])
  .range([padding, h - padding]);
let svg;
let showGraph = () => {
  count = 0;
  let data = d3.select("#exp").property("value");
  let res = getData(data);
  if (svg) svg.remove();
  svg = d3
    .select("#graph")
    .append("svg")
    .attr("fill", "#fff")
    .attr("width", w)
    .attr("height", h);

  let root = d3.hierarchy(res);
  let layout = d3.cluster();
  layout.size([w, h]);
  layout(root);
  console.log(res);
  //   let g = svg.append("g");

  svg
    .selectAll("line")
    .data(root.links())
    .enter()
    .append("line")
    .attr("stroke", "black")
    .attr("x1", d => scale(d.source.x))
    .attr("x2", d => scale(d.target.x))
    .attr("y1", d => scale(d.source.y))
    .attr("y2", d => scale(d.target.y));

  let nodes = svg
    .selectAll("g")
    .data(root.descendants())
    .enter()
    .append("g");
  nodes
    .append("circle")
    .attr("fill", d => (d.data.error ? "red" : "blue"))
    .attr("cx", d => scale(d.x))
    .attr("cy", d => scale(d.y))
    .attr("r", 10);

  nodes
    .append("text")
    .text(d => (d.data.value ? d.data.value : d.data.name))
    .attr("fill", "black")
    .attr("x", d => (d.data.value ? scale(d.x) : scale(d.x) + 13))
    .attr("y", d => (d.data.value ? scale(d.y) + 30 : scale(d.y)));
};

let getData = raw => {
  count++;
  if (raw.length == 0) return { name: raw, error: true };
  if (!raw.match(/\W/gi)) return { name: "f" + count, value: raw };
  let firstChar = raw.charAt(0);
  switch (firstChar) {
    case "(":
      let lastC = raw.charAt(raw.length - 1);
      if (lastC != ")") return { name: raw, error: true };
      let counter = 1;
      for (let i = 1; i < raw.length; i++) {
        let c = raw.charAt(i);
        if (counter == 0) {
          let p = raw.charAt(i);
          if (!p.match(/\W/)) return { error: true, name: raw };
          if (raw.charAt(i + 1) != "(") return { error: true, name: raw };
          let newExp1 = raw.substring(1, i - 1);
          let newExp2 = raw.substring(i + 2, raw.length - 1);
          let name = `(f${count})${p}`;
          let child1 = getData(newExp1);
          name += `(f${count})`;
          let child2 = getData(newExp2);
          res = {
            name,
            children: [child1, child2]
          };
          return res;
        }
        counter = c == "(" ? counter + 1 : c == ")" ? counter - 1 : counter;
        if (counter < 0) return { name: raw, error: true }; //should not be executed at all
      }
    case "~":
      if (raw.charAt(1) == "(" && raw.charAt(raw.length - 1) == ")") {
        let newExp = raw.substring(2, raw.length - 1);
        let name = `~(f${count})`;
        let children = getData(newExp);
        return { name, children: [children] };
      }
    default:
      return { name: raw, error: true };
  }
};
