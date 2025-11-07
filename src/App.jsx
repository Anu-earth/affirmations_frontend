import { useState, useEffect } from 'react'
import './App.css'
import database from './database.json'

function App() {
  const [showButtons, setShowButtons] = useState(false)
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'takeout', 'completed'
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0)
  const [viewedIndices, setViewedIndices] = useState(new Set())
  const [shuffledIndices, setShuffledIndices] = useState([])

  // Show buttons after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Shuffle affirmations when entering takeout page
  useEffect(() => {
    if (currentPage === 'takeout') {
      const indices = Array.from({ length: database.affirmations.length }, (_, i) => i)
      // Shuffle array
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]]
      }
      setShuffledIndices(indices)
      setCurrentAffirmationIndex(0)
      setViewedIndices(new Set([indices[0]]))
    }
  }, [currentPage])

  // Check if all affirmations have been viewed
  useEffect(() => {
    if (currentPage === 'takeout' && viewedIndices.size === database.affirmations.length) {
      const timer = setTimeout(() => {
        setCurrentPage('completed')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [viewedIndices.size, currentPage])

  const handleTakeoutClick = () => {
    setCurrentPage('takeout')
  }

  const handleSaladMixClick = () => {
    // Placeholder for future implementation
    alert('Salad mix coming soon!')
  }

  const handlePickAdventureClick = () => {
    // Placeholder for future implementation
    alert('Pick your adventure coming soon!')
  }

  const handleNextAffirmation = () => {
    if (currentAffirmationIndex < shuffledIndices.length - 1) {
      const nextIndex = currentAffirmationIndex + 1
      setCurrentAffirmationIndex(nextIndex)
      setViewedIndices(prev => new Set([...prev, shuffledIndices[nextIndex]]))
    }
  }

  const handlePrevAffirmation = () => {
    if (currentAffirmationIndex > 0) {
      setCurrentAffirmationIndex(currentAffirmationIndex - 1)
    }
  }

  const handleRepeat = () => {
    setCurrentPage('takeout')
  }

  const handleExit = () => {
    setCurrentPage('home')
    setShowButtons(true)
  }

  // Home page with initial text
  if (currentPage === 'home') {
    return (
      <div className="app-container">
        <div className="home-screen">
          <div className="initial-text">
            <p>May you be peaceful</p>
            <p>May you be healthy</p>
            <p>May you be happy</p>
            <p>May you gift to the world</p>
          </div>
          {showButtons && (
            <div className="buttons-container">
              <button className="option-button" onClick={handleTakeoutClick}>
                Takeout
              </button>
              <button className="option-button" onClick={handleSaladMixClick}>
                Salad mix
              </button>
              <button className="option-button" onClick={handlePickAdventureClick}>
                Pick your adventure
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Takeout page
  if (currentPage === 'takeout') {
    if (shuffledIndices.length === 0) {
      return null // Wait for shuffle to complete
    }
    const currentAffirmation = database.affirmations[shuffledIndices[currentAffirmationIndex]]

    return (
      <div className="app-container">
        <div className="takeout-screen">
          <h1 className="takeout-title">Takeout</h1>
          <div className="affirmation-container">
            <button 
              className="arrow-button left" 
              onClick={handlePrevAffirmation}
              disabled={currentAffirmationIndex === 0}
            >
              ←
            </button>
            <div className="affirmation-text">
              {currentAffirmation}
            </div>
            <button 
              className="arrow-button right" 
              onClick={handleNextAffirmation}
              disabled={currentAffirmationIndex === shuffledIndices.length - 1}
            >
              →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Completed page
  if (currentPage === 'completed') {
    return (
      <div className="app-container">
        <div className="takeout-screen">
          <h1 className="takeout-title">Takeout</h1>
          <div className="completion-screen">
            <p className="completion-message">Have a great day! Bye &lt;3</p>
            <div className="action-buttons">
              <button className="action-button" onClick={handleExit}>
                Exit
              </button>
              <button className="action-button" onClick={handleRepeat}>
                Repeat
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default App
