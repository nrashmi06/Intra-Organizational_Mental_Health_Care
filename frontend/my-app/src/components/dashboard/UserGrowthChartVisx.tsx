// components/UserGrowthChartVisx.tsx

import { LinePath, Line } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';

interface DataPoint {
  date: string;
  users: number;
}

interface UserGrowthChartProps {
  data: DataPoint[];
}

const UserGrowthChartVisx: React.FC<UserGrowthChartProps> = ({ data }) => {
  const xScale = scaleLinear({
    domain: [0, data.length - 1],
    range: [0, 800],  // Adjust the width as necessary
  });

  const yScale = scaleLinear({
    domain: [Math.min(...data.map(d => d.users)), Math.max(...data.map(d => d.users))],
    range: [400, 0],  // Adjust the height as necessary
  });

  return (
    <svg width={900} height={500}>
      <Group>
        <LinePath
          data={data}
          x={(d, i) => xScale(i)}
          y={d => yScale(d.users)}
          stroke="blue"
          strokeWidth={2}
          curve={d3.curveMonotoneX}
        />
      </Group>
    </svg>
  );
};

export default UserGrowthChartVisx;
