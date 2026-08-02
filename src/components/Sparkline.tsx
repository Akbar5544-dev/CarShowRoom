import React, {memo} from 'react';
import Svg, {Path} from 'react-native-svg';

type SparklineProps = {
  color: string;
  width?: number;
  height?: number;
  points?: number[];
};

export const Sparkline = memo(function Sparkline({
  color,
  width = 120,
  height = 28,
  points = [8, 14, 10, 18, 12, 22, 16, 24],
}: SparklineProps) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const stepX = width / (points.length - 1);

  const d = points
    .map((point, index) => {
      const x = index * stepX;
      const y = height - ((point - min) / range) * (height - 4) - 2;
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height}>
      <Path d={d} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
    </Svg>
  );
});
