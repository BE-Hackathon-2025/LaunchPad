import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { aiService } from '../../services/ai'
import Card from '../Card'
import Button from '../Button'
import Select from '../Select'
import Badge from '../Badge'
import skillsData from '../../data/skills.json'

const InterviewStudio = () => {
  const { profile, settings, addInterviewSession, interviewSessions } = useStore()
  const [selectedRole, setSelectedRole] = useState('')
  const [company, setCompany] = useState('')
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [sessionResults, setSessionResults] = useState([])

  const roleOptions = Object.keys(skillsData).map(key => ({
    value: key,
    label: skillsData[key].role
  }))

  const handleGenerateQuestions = async () => {
    if (!selectedRole) return

    setIsGenerating(true)
    aiService.initialize(settings.apiKey)

    try {
      const generatedQuestions = await aiService.generateInterviewQuestions(
        skillsData[selectedRole].role,
        company || undefined
      )
      setQuestions(generatedQuestions)
      setCurrentQuestionIndex(0)
      setAnswer('')
      setEvaluation(null)
      setSessionComplete(false)
      setSessionResults([])
    } catch (error) {
      console.error('Error generating questions:', error)
      alert('Failed to generate questions. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      alert('Please provide an answer before submitting.')
      return
    }

    setIsEvaluating(true)
    aiService.initialize(settings.apiKey)

    try {
      const result = await aiService.evaluateAnswer(
        questions[currentQuestionIndex],
        answer
      )
      setEvaluation(result)

      // Store result
      const newResult = {
        question: questions[currentQuestionIndex],
        answer,
        evaluation: result
      }
      setSessionResults([...sessionResults, newResult])
    } catch (error) {
      console.error('Error evaluating answer:', error)
      alert('Failed to evaluate answer. Please try again.')
    } finally {
      setIsEvaluating(false)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setAnswer('')
      setEvaluation(null)
    } else {
      // Session complete
      setSessionComplete(true)
      const avgScore = Math.round(
        sessionResults.reduce((sum, r) => sum + r.evaluation.score, 0) / sessionResults.length
      )

      addInterviewSession({
        role: selectedRole,
        company,
        date: new Date().toISOString(),
        results: sessionResults,
        averageScore: avgScore
      })
    }
  }

  const handleReset = () => {
    setSelectedRole('')
    setCompany('')
    setQuestions([])
    setCurrentQuestionIndex(0)
    setAnswer('')
    setEvaluation(null)
    setSessionComplete(false)
    setSessionResults([])
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interview Studio 🎤
          </h1>
          <p className="text-gray-600">
            Practice interviews with AI-generated questions and instant feedback
          </p>
        </div>

        {/* Previous Sessions Summary */}
        {interviewSessions.length > 0 && !questions.length && (
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Sessions</h3>
            <div className="space-y-3">
              {interviewSessions.slice(-3).reverse().map((session, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {skillsData[session.role]?.role || session.role}
                      {session.company && ` at ${session.company}`}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      session.averageScore >= 80 ? 'text-green-600' :
                      session.averageScore >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {session.averageScore}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Setup */}
        {!questions.length && !sessionComplete && (
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Start New Practice Session</h3>
            <div className="space-y-4">
              <Select
                label="Select Role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                options={roleOptions}
                required
              />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company (optional)"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button
                onClick={handleGenerateQuestions}
                disabled={!selectedRole || isGenerating}
                fullWidth
                size="lg"
              >
                {isGenerating ? 'Generating Questions...' : 'Generate Interview Questions'}
              </Button>
            </div>
          </Card>
        )}

        {/* Interview Questions */}
        {questions.length > 0 && !sessionComplete && (
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(((currentQuestionIndex) / questions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                />
              </div>
            </Card>

            {/* Current Question */}
            <Card className="bg-gradient-to-br from-secondary/5 to-primary/5 border-2 border-secondary/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold flex-shrink-0">
                  {currentQuestionIndex + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {questions[currentQuestionIndex]}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Take your time and provide a detailed answer.
                  </p>
                </div>
              </div>
            </Card>

            {/* Answer Input */}
            <Card>
              <label className="block mb-3 font-semibold text-gray-900">
                Your Answer:
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                disabled={evaluation !== null}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:bg-gray-50"
              />
              <div className="text-sm text-gray-500 mt-2">
                Tip: Use the STAR method (Situation, Task, Action, Result)
              </div>
            </Card>

            {/* Evaluation */}
            {evaluation && (
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📊</span>
                  Your Evaluation
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Score</span>
                      <span className={`text-3xl font-bold ${
                        evaluation.score >= 80 ? 'text-green-600' :
                        evaluation.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {evaluation.score}/100
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          evaluation.score >= 80 ? 'bg-green-500' :
                          evaluation.score >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${evaluation.score}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Feedback:</h4>
                    <p className="text-gray-700">{evaluation.feedback}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Improvements:</h4>
                    <ul className="space-y-2">
                      {evaluation.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span className="text-gray-700">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {!evaluation ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim() || isEvaluating}
                  fullWidth
                  size="lg"
                >
                  {isEvaluating ? 'Evaluating...' : 'Submit Answer'}
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  fullWidth
                  size="lg"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Complete Session'}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Session Complete */}
        {sessionComplete && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Session Complete!
              </h2>
              <p className="text-gray-600 mb-6">
                Great work! Here's your summary:
              </p>
              <div className="inline-block bg-white rounded-2xl px-8 py-6">
                <div className="text-5xl font-bold text-primary mb-2">
                  {Math.round(sessionResults.reduce((sum, r) => sum + r.evaluation.score, 0) / sessionResults.length)}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Question Breakdown</h3>
              <div className="space-y-4">
                {sessionResults.map((result, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          Question {idx + 1}
                        </div>
                        <div className="text-sm text-gray-600">{result.question}</div>
                      </div>
                      <Badge
                        variant={result.evaluation.score >= 80 ? 'success' : result.evaluation.score >= 60 ? 'warning' : 'default'}
                        size="lg"
                      >
                        {result.evaluation.score}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleReset} fullWidth size="lg">
                Start New Session
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InterviewStudio
