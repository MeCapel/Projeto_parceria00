import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataItem {
  label: string;
  value: number;
  color: string;
  [key: string]: unknown;
}

interface PieChartProps {
  data: DataItem[];
  title: string;
  formatTooltip?: (data: DataItem) => string;
}

export default function PieChart({
  data,
  formatTooltip,
}: PieChartProps) {

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 180;
    const height = 180;
    const radius = Math.min(width, height) / 2 - 20;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie<DataItem>()
      .value((d) => d.value)
      .sort(null);

    // ✅ TIPAGEM CORRETA DO ARC
    const arcGenerator = d3
      .arc<d3.PieArcDatum<DataItem>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    const arcHover = d3
      .arc<d3.PieArcDatum<DataItem>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius + 10);

    const tooltip = d3.select(tooltipRef.current)
      .style("opacity", 0)
      .style("position", "fixed")
      .style("background-color", "rgba(255, 255, 255, 0.9)")
      .style("border", "1px solid #ccc")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("pointer-events", "none");

    const arcs = g.selectAll<SVGPathElement, d3.PieArcDatum<DataItem>>("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", (d) => arcGenerator(d)!) // ✅ CORREÇÃO PRINCIPAL
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#fff")
      .style("stroke-width", "2px")
      .style("cursor", "pointer");

    arcs
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", arcHover(d)!); 

        tooltip.transition()
          .duration(200)
          .style("opacity", 1);

        const percentage =
          d.value && data.length
            ? ((d.data.value / d3.sum(data, (x) => x.value)) * 100).toFixed(1)
            : "0.0";

        const content = formatTooltip
          ? formatTooltip(d.data)
          : `<strong>${d.data.label}</strong><br/>${d.data.value} (${percentage}%)`;

        tooltip.html(content)
          .style("left", `${event.clientX + 10}px`)
          .style("top", `${event.clientY - 28}px`);
      })

      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.clientX + 10}px`)
          .style("top", `${event.clientY - 28}px`);
      })

      .on("mouseout", function () {
        d3.select<SVGPathElement, d3.PieArcDatum<DataItem>>(this)
          .transition()
          .duration(200)
          .attr("d", (d) => arcGenerator(d)!); 

        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

  }, [data, formatTooltip]);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg ref={svgRef} />
      <div ref={tooltipRef}></div>

      <div className="mt-2 space-y-1">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>
              {item.label}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ISIS