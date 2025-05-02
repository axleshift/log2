import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { CChart } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = ({ inventory, purchaseOrders }) => {
  const chartRef = useRef(null)

  const getMonthlyData = (data, dateField) => {
    if (!Array.isArray(data)) {
      console.error('Expected array:', data)
      return new Array(12).fill(0)
    }

    const monthlyData = new Array(12).fill(0)

    data.forEach((item) => {
      if (item[dateField]) {
        const date = new Date(item[dateField])
        const month = date.getMonth()
        monthlyData[month] += 1
      }
    })

    return monthlyData
  }

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.x.ticks.color = getStyle('--cui-body-color')
          chartRef.current.options.scales.y.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.y.ticks.color = getStyle('--cui-body-color')
          chartRef.current.update()
        })
      }
    })
  }, [chartRef])

  const inventoryData = getMonthlyData(inventory, 'createdAt')
  const poData = getMonthlyData(purchaseOrders, 'purchaseDate')

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  return React.createElement(CChart, {
    type: 'bar',
    ref: chartRef,
    style: { height: '300px', marginTop: '40px' },
    data: {
      labels: months,
      datasets: [
        {
          label: 'Purchase Orders',
          backgroundColor: getStyle('--cui-primary'),
          borderColor: getStyle('--cui-primary'),
          borderWidth: 1,
          data: poData,
        },
        {
          label: 'Inventory Items',
          backgroundColor: getStyle('--cui-warning'),
          borderColor: getStyle('--cui-warning'),
          borderWidth: 1,
          data: inventoryData,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
      },
      scales: {
        x: {
          grid: {
            color: getStyle('--cui-border-color-translucent'),
            drawOnChartArea: false,
          },
          ticks: { color: getStyle('--cui-body-color') },
        },
        y: {
          beginAtZero: true,
          grid: { color: getStyle('--cui-border-color-translucent') },
          ticks: { color: getStyle('--cui-body-color'), stepSize: 1 },
        },
      },
    },
  })
}

MainChart.propTypes = {
  inventory: PropTypes.array.isRequired,
  purchaseOrders: PropTypes.array.isRequired,
}

export default MainChart
