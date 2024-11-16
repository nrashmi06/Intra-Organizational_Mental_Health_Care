// components/UserGrowthChartNivo.tsx

import { ResponsiveLine } from '@nivo/line';

interface UserGrowthData {
  id: string;
  data: { x: string; y: number }[];
}

interface UserGrowthChartProps {
  data: UserGrowthData[];
}

const UserGrowthChartNivo: React.FC<UserGrowthChartProps> = ({ data }) => {
  return (
    <div style={{ height: 400 }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', stacked: false, min: 'auto', max: 'auto' }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Month',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Users',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        enableGridX={false}
        enableGridY={true}
        lineWidth={3}
        colors={{ scheme: 'category10' }}
        pointSize={10}
        pointColor={{ from: 'color' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enablePointLabel={true}
        pointLabel="y"
        pointLabelYOffset={-12}
        useMesh={true}
      />
    </div>
  );
};

export default UserGrowthChartNivo;
