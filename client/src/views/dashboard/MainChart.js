import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'

const MainChart = ({ inventory, purchaseOrders }) => {
  const formatDate = (dateStr) => new Date(dateStr).toISOString().slice(0, 10)

  const data = useMemo(() => {
    const poCounts = {}
    const invCounts = {}

    purchaseOrders.forEach((po) => {
      const date = formatDate(po.createdAt || po.date || new Date())
      poCounts[date] = (poCounts[date] || 0) + 1
    })

    inventory.forEach((item) => {
      const date = formatDate(item.createdAt || item.date || new Date())
      invCounts[date] = (invCounts[date] || 0) + 1
    })

    const allDates = Array.from(
      new Set([...Object.keys(poCounts), ...Object.keys(invCounts)]),
    ).sort()

    return allDates.map((date) => ({
      date,
      PurchaseOrders: poCounts[date] || 0,
      Inventory: invCounts[date] || 0,
    }))
  }, [purchaseOrders, inventory])

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '2rem auto',
        backgroundColor: '#1e1e2f',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 6px 15px rgba(0,0,0,0.4)',
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#ddd',
      }}
    >
      <h4
        style={{
          marginBottom: '1.5rem',
          fontWeight: '700',
          color: '#eee',
          textAlign: 'center',
          fontSize: '1.6rem',
          letterSpacing: '0.03em',
        }}
      >
        Purchase Orders & Inventory Over Time
      </h4>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#44475a" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#aaa' }}
            stroke="#666"
            minTickGap={15}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#aaa' }}
            stroke="#666"
            width={50}
          />
          <Tooltip
            wrapperStyle={{
              backgroundColor: '#2e2e42',
              borderRadius: '8px',
              border: '1px solid #555',
              color: '#ddd',
              fontWeight: '600',
            }}
            labelStyle={{ fontWeight: '700', color: '#fff' }}
            contentStyle={{ backgroundColor: '#2e2e42' }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontWeight: '600', color: '#ccc' }}
          />
          <Line
            type="monotone"
            dataKey="PurchaseOrders"
            stroke="#5a9bd6"
            activeDot={{ r: 8, fill: '#8ab6ff' }}
            strokeWidth={3}
            dot={{ r: 4, stroke: '#8ab6ff', strokeWidth: 1, fill: '#4a7bc1' }}
          />
          <Line
            type="monotone"
            dataKey="Inventory"
            stroke="#4ba3a3"
            strokeWidth={3}
            dot={{ r: 4, stroke: '#6dc7c7', strokeWidth: 1, fill: '#317373' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

MainChart.propTypes = {
  inventory: PropTypes.arrayOf(PropTypes.object).isRequired,
  purchaseOrders: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default MainChart
