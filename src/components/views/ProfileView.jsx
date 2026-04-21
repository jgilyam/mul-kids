import { useUser } from '../../hooks/useUser'
import { useRecommendation } from '../../hooks/useRecommendation'
import { useHistory } from '../../hooks/useHistory'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import styles from './ProfileView.module.css'

/**
 * Profile view: user info, stats, and table recommendation.
 */
export default function ProfileView() {
  const { user, clearUser } = useUser()
  const { totalSessions } = useHistory()
  const { recommendedTable, hasEnoughData, performanceScores } = useRecommendation()

  if (!user) {
    return (
      <div className={styles.container}>
        <Card title="Perfil">
          <p className={styles.empty}>No hay usuario registrado.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Card title="Perfil">
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{user.name}</h2>
          <p className={styles.userId}>ID: {user.id}</p>
          <p className={styles.userSince}>
            Miembro desde: {new Date(user.createdAt).toLocaleDateString('es-MX')}
          </p>
        </div>
      </Card>

      <Card title="Estadísticas Generales">
        <div className={styles.statRow}>
          <span className={styles.statLabel}>Total de Sesiones</span>
          <span className={styles.statValue}>{totalSessions}</span>
        </div>
      </Card>

      <Card title="Tabla Recomendada">
        {hasEnoughData ? (
          <div className={styles.recommendation}>
            <Badge variant="info">Tabla del {recommendedTable}</Badge>
            <p>Practica esta tabla para mejorar tu velocidad y precisión.</p>
            {Object.entries(performanceScores)
              .filter(([, score]) => score > 0)
              .length > 0 && (
              <details>
                <summary>Ver puntajes de todas las tablas</summary>
                <ul>
                  {Object.entries(performanceScores)
                    .filter(([, score]) => score > 0)
                    .sort(([, a], [, b]) => a - b)
                    .map(([table, score]) => (
                      <li key={table}>
                        Tabla {table}: {(score * 100).toFixed(1)}%
                      </li>
                    ))}
                </ul>
              </details>
            )}
          </div>
        ) : (
          <p>Completa algunas sesiones para recibir recomendaciones personalizadas.</p>
        )}
      </Card>

      <Card title="Cuenta">
        <div className={styles.accountActions}>
          <Button variant="ghost" onClick={clearUser}>
            Cambiar Nombre
          </Button>
        </div>
      </Card>
    </div>
  )
}
