import { useRef, useEffect } from 'react'
import { useGame } from '../../hooks/useGame'
import TableSelector from '../game/TableSelector'
import QuestionCard from '../game/QuestionCard'
import AnswerInput from '../game/AnswerInput'
import Timer from '../game/Timer'
import ScoreFeedback from '../game/ScoreFeedback'
import SummaryView from './SummaryView'
import styles from './GameView.module.css'

/**
 * Main gameplay orchestrator view
 * Manages the game state machine and renders appropriate components
 * for each phase: idle -> playing -> feedback -> summary
 */
export default function GameView() {
  const {
    phase,
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedTable,
    lastFeedback,
    startGame,
    submitAnswer,
    nextQuestion,
    getResults,
    reset
  } = useGame()

  const timerRef = useRef(null)

  // Timer management based on phase transitions
  useEffect(() => {
    if (phase === 'playing' && timerRef.current) {
      // Reset timer when entering a new question
      timerRef.current.reset()
    }
  }, [phase, currentIndex])

  const handleTableSelect = (table) => {
    startGame(table)
  }

  const handleAnswerSubmit = (answer) => {
    submitAnswer(answer)
  }

  const handleContinue = () => {
    nextQuestion()
  }

  const handlePlayAgain = () => {
    reset()
  }

  const handleViewProgress = () => {
    // This would normally switch tabs in the parent App component
    // For now, just reset to allow another game
    reset()
  }

  // Render based on phase
  if (phase === 'idle') {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Selecciona una Tabla</h1>
          <TableSelector onSelect={handleTableSelect} />
        </div>
      </div>
    )
  }

  if (phase === 'playing' && currentQuestion) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.timerContainer}>
            <Timer ref={timerRef} isRunning={true} />
          </div>

          <QuestionCard
            table={currentQuestion.table}
            multiplier={currentQuestion.multiplier}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
          />

          <AnswerInput onSubmit={handleAnswerSubmit} />
        </div>
      </div>
    )
  }

  if (phase === 'feedback' && lastFeedback) {
    return (
      <>
        {/* Keep the question view in background */}
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.timerContainer}>
              <Timer ref={timerRef} isRunning={false} />
            </div>

            {currentQuestion && (
              <QuestionCard
                table={currentQuestion.table}
                multiplier={currentQuestion.multiplier}
                questionNumber={currentIndex + 1}
                totalQuestions={totalQuestions}
              />
            )}

            <AnswerInput onSubmit={() => {}} disabled />
          </div>
        </div>

        {/* Overlay feedback */}
        <ScoreFeedback
          isCorrect={lastFeedback.isCorrect}
          correctAnswer={lastFeedback.correctAnswer}
          userAnswer={lastFeedback.userAnswer}
          score={lastFeedback.score}
          onContinue={handleContinue}
        />
      </>
    )
  }

  if (phase === 'summary') {
    const session = getResults()
    return (
      <SummaryView
        session={session}
        onPlayAgain={handlePlayAgain}
        onViewProgress={handleViewProgress}
      />
    )
  }

  // Fallback (should never reach here)
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p>Cargando...</p>
      </div>
    </div>
  )
}
