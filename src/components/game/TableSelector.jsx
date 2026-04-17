import Badge from '../ui/Badge'
import Button from '../ui/Button'
import styles from './TableSelector.module.css'

/**
 * Grid of buttons to select multiplication table or mixed mode
 *
 * @param {Object} props
 * @param {(table: number | null) => void} props.onSelect - Called with table number (1-10) or null for mixed mode
 * @param {number | null} [props.recommendedTable] - Table to highlight with badge
 */
export default function TableSelector({ onSelect, recommendedTable = null }) {
  const tables = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div className={styles.container}>
      <div className={styles.tableGrid}>
        {tables.map(table => (
          <div key={table} className={styles.tableButtonWrapper}>
            <Button
              onClick={() => onSelect(table)}
              size="lg"
              variant={table === recommendedTable ? 'primary' : 'secondary'}
            >
              Tabla del {table}
            </Button>
            {table === recommendedTable && (
              <Badge variant="success" className={styles.badge}>
                Recomendada
              </Badge>
            )}
          </div>
        ))}
      </div>

      <div className={styles.mixedMode}>
        <Button
          onClick={() => onSelect(null)}
          size="lg"
          variant="ghost"
        >
          Modo Mixto
        </Button>
      </div>
    </div>
  )
}
