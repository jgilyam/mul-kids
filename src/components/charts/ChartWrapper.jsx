/**
 * Shared wrapper for Chart.js components.
 * Provides responsive sizing, loading states, and accessible data table fallback.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Chart component
 * @param {string} [props.title] - Accessible title for chart
 * @param {boolean} [props.isLoading=false] - Loading state
 * @param {Array<Object>} [props.data] - Data for accessible table fallback
 * @param {string} [props.className] - Additional CSS classes
 */
export default function ChartWrapper({ children, title, isLoading = false, data, className = '' }) {
  return (
    <div className={`chart-wrapper ${className}`} role="img" aria-label={title}>
      {isLoading && (
        <div className="chart-loading" aria-live="polite">
          Cargando gráfico...
        </div>
      )}
      {!isLoading && (
        <>
          <div className="chart-canvas" aria-hidden="true">
            {children}
          </div>
          {data && data.length > 0 && (
            <details className="chart-data-table">
              <summary>Ver datos en tabla</summary>
              <table>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((value, j) => (
                        <td key={j}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          )}
        </>
      )}
    </div>
  )
}
