import { useState } from 'react'
import { useUser } from '../../hooks/useUser'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Button from '../ui/Button'
import styles from './RegisterView.module.css'

/**
 * Full registration view with validation
 */
export default function RegisterView() {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register, validationError } = useUser()


  const handleNameChange = (newName) => {
    setName(newName)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await register(name)
    } catch (error) {
    }
    setIsLoading(false)
  }

  return (
    <div className={styles.container}>
      <Card title="Bienvenido a Mat-Kids">
        <form onSubmit={handleSubmit} className={styles.form}>
          <p className={styles.description}>
            Ingresa tu nombre para comenzar a practicar las tablas de multiplicar
          </p>
          <Input
            label="Tu nombre"
            type="text"
            value={name}
            onChange={handleNameChange}
            error={validationError}
            autoFocus
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? 'Registrando...' : 'Comenzar'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
