import { useState, useRef, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { aiService } from '../../services/ai'
import Card from '../Card'
import Button from '../Button'
import Input from '../Input'

const CareerCopilot = () => {
  const { profile, roadmap, chatHistory, addChatMessage, settings } = useStore()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    }

    addChatMessage(userMessage)
    setInput('')
    setIsLoading(true)

    // Initialize AI
    aiService.initialize(settings.apiKey)

    // Prepare context
    const context = {
      profile,
      roadmap,
      currentPhase: roadmap?.phases.find(p =>
        p.milestones.some(m => m.status === 'in_progress')
      )?.name
    }

    // Get AI response
    try {
      const messages = chatHistory.concat([userMessage]).map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await aiService.chatResponse(messages, context)

      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      }

      addChatMessage(assistantMessage)
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }
      addChatMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestedQuestions = [
    "What should I focus on this month?",
    "What's the difference between a data analyst and data scientist?",
    "How do I prepare for technical interviews?",
    "Which skills are most in-demand right now?"
  ]

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Career Copilot 💬
        </h1>
        <p className="text-gray-600">
          Ask me anything about your career path, skills, or opportunities
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {chatHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👋</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Hi {profile?.name}!
              </h3>
              <p className="text-gray-600 mb-8">
                I'm your AI career advisor. Ask me anything!
              </p>

              <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="p-4 text-left rounded-xl border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <span className="text-sm text-gray-700">{question}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {chatHistory.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🤖</span>
                  </div>
                  <Card className="flex-1 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </Card>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 px-6 py-4 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="rounded-full px-8"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
        ${isUser ? 'bg-secondary/10' : 'bg-primary/10'}
      `}>
        <span className="text-xl">{isUser ? '👤' : '🤖'}</span>
      </div>

      <Card className={`flex-1 max-w-2xl ${isUser ? 'bg-secondary/5 border-secondary/20' : ''}`}>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </Card>
    </div>
  )
}

export default CareerCopilot
