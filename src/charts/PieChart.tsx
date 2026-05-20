import { useMemo, useRef, useState } from "react";
import * as d3 from "d3";

export type PieData = {
  name: string;
  value: number;
};

type PieChartProps = {
  title: string,
  data: PieData[];
  width?: number;
  height?: number;
};

const COLORS = [
  "#9E3D45",
  "#334F5C",
  "#00762E",
  "#F5A32B",
];

export function PieChart({ title, data, width = 400, height = 400 }: PieChartProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    label: string;
    value: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Soma total
  const total = useMemo(() => {
    return data.reduce((acc, item) => acc + item.value, 0);
  }, [data]);

  // Responsivo
  const radius = Math.min(width, height) / 2;

  // Pizza
  const pieGenerator = d3
    .pie<PieData>()
    .value((d) => d.value)
    .sort(null);

  const pieData = pieGenerator(data);

  // Arcos
  const arcGenerator = d3
    .arc<d3.PieArcDatum<PieData>>()
    .innerRadius(0)
    .outerRadius(radius - 10);

  return (
    <div className="container-fluid card-chart card-chart-hover" style={{ width: (width + 150) }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="fs-5 fw-semibold d-flex align-items-center justify-content-center text-custom-black">
            {title}
          </div>

          <hr />

          <div
            className="position-relative w-100"
            ref={containerRef}
            style={{
              maxWidth: width,
              margin: "0 auto",
            }}
          >
            {/* SVG Responsivo */}
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-100 h-auto"
            >
              <g transform={`translate(${width / 2}, ${height / 2})`}>
                {pieData.map((arc, index) => {
                  const path = arcGenerator(arc);

                  return (
                    <path
                      key={arc.data.name}
                      d={path || ""}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                      onMouseMove={(event) => {
                        if (!containerRef.current) return;

                        const rect = containerRef.current.getBoundingClientRect();

                        setTooltip({
                          x: event.clientX - rect.left,
                          y: event.clientY - rect.top,
                          label: arc.data.name,
                          value: arc.data.value,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        cursor: "pointer",
                        transition: "0.2s",
                      }}
                    />
                  );
                })}
              </g>
            </svg>

            {/* Tooltip */}
            {tooltip && (
              <div
                className="position-absolute bg-dark text-white p-2 rounded shadow"
                style={{
                  top: tooltip.y + 10,
                  left: tooltip.x + 10,
                  fontSize: 14,
                  pointerEvents: "none",
                  zIndex: 999,
                }}
              >
                <strong>{tooltip.label}</strong>
                <br />
                Quantidade: {tooltip.value}
                <br />
                Percentual:{" "}
                {((tooltip.value / total) * 100).toFixed(1)}%
              </div>
            )}

            {/* Legendas */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
              {data.map((item, index) => (
                <div
                  key={item.name}
                  className="d-flex align-items-center gap-2"
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      background:
                        COLORS[index % COLORS.length],
                      borderRadius: 4,
                    }}
                  />

                  <span className="small">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}