import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';




type graphData = 
  {
     name: string;
     value: number;
 }
const COLORS = ['#0088FE', '#00C49F', '#FFBB28','#FF0000',
  // '#800080'
];

export default function Graph({data}:{ data: graphData[] }) {

  return (
    <PieChart width={500} height={400}>
      <Pie data={data} dataKey="value" nameKey="name" outerRadius={150} fill="#8884d8">
        {data.map((_, index) => (
          <Cell  key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}