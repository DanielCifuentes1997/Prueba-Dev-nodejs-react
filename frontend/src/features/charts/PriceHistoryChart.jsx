import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const PriceHistoryChart = ({ data }) => {
  return (
    <div className="chart-area">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data || []}>
          <XAxis dataKey="time" hide />
          <YAxis domain={['auto', 'auto']} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            itemStyle={{ color: '#38bdf8' }}
          />
          <Line type="monotone" dataKey="price" stroke="#38bdf8" strokeWidth={3} dot={false} animationDuration={400} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriceHistoryChart