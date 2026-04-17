import styles from './TabNavigation.module.css'

/**
 * Tab-based navigation between views
 *
 * @param {Object} props
 * @param {{ id: string, label: string }[]} props.tabs
 * @param {string} props.activeTab - ID of active tab
 * @param {(tabId: string) => void} props.onTabChange
 */
export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <nav className={styles.navigation} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        const className = isActive
          ? `${styles.tab} ${styles.active}`
          : styles.tab

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={className}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
