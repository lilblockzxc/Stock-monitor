/**Компонент рендерит свечку */
export const CandleShape = (props: any) => {
  const { x, y, width, payload } = props;

  if (!payload) return null;

  const isGrowing = payload.close >= payload.open;
  const color = isGrowing ? "green" : "red";

  const candleHeight = Math.max(10, Math.abs(payload.open - payload.close));

  return (
    <g>
      <title>{`Open: ${payload.open}, Close: ${payload.close}`}</title>
      <rect
        x={x}
        y={y}
        width={width}
        height={candleHeight}
        fill={color}
        stroke="black"
      />
    </g>
  );
};
