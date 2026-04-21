import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import ChartWrapper from './ChartWrapper'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

/**
 * Bar chart for weekly progress: sessions per day with avg score line overlay.
 *
 * @param {Object} props
 * @param {{ date: string, sessions: number, avgScore: number }[]} props.data
 */
export default function WeeklyProgressChart({ data }) {
  const labels = data.map((d) => {
    const date = new Date(d.date)
    return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' })
  })

  const chartData = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Sesiones',
        data: data.map((d) => d.sessions),
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        type: 'line',
        label: 'Puntaje Promedio',
        data: data.map((d) => d.avgScore),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        yAxisID: 'y1'
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Sesiones'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Puntaje'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: false
      }
    }
  }

  return (
    <ChartWrapper title="Progreso semanal: sesiones y puntaje por día" data={data}>
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </ChartWrapper>
  )
}
