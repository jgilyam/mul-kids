import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import ChartWrapper from './ChartWrapper'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

/**
 * Horizontal bar chart for accuracy per table (1-10).
 * Color gradient: red (low accuracy) to green (high accuracy).
 *
 * @param {Object} props
 * @param {{ table: number, accuracy: number, avgTime: number, attempts: number, correct: number }[]} props.data
 */
export default function TablePerformanceChart({ data }) {
  const labels = data.map((d) => `Tabla ${d.table}`)

  // Color gradient based on accuracy
  const backgroundColors = data.map((d) => {
    const accuracy = d.accuracy
    if (accuracy >= 80) return 'rgba(34, 197, 94, 0.7)' // green
    if (accuracy >= 60) return 'rgba(234, 179, 8, 0.7)' // yellow
    return 'rgba(239, 68, 68, 0.7)' // red
  })

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Precisión (%)',
        data: data.map((d) => d.accuracy),
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map((c) => c.replace('0.7', '1')),
        borderWidth: 1
      }
    ]
  }

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Precisión (%)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    }
  }

  return (
    <ChartWrapper title="Precisión por tabla: del 1 al 10" data={data}>
      <div style={{ height: '400px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </ChartWrapper>
  )
}
