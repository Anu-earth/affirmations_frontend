import { useState, useEffect } from 'react'
import './App.css'
import { config } from './config'
import localDatabase from './database.json'

function App() {
  const [affirmations, setAffirmations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showButtons, setShowButtons] = useState(false)
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'takeout', 'completed'
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0)
  const [viewedIndices, setViewedIndices] = useState(new Set())
  const [shuffledIndices, setShuffledIndices] = useState([])

  // Fetch affirmations from API, fallback to local database
  useEffect(() => {
    const fetchAffirmations = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Try to fetch from API first
        try {
          console.log('Fetching from API:', config.apiEndpoint)
          const response = await fetch(config.apiEndpoint)
          
          console.log('API Response status:', response.status, response.statusText)
          
          if (!response.ok) {
            const errorText = await response.text()
            console.error('API Error Response:', errorText)
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
          }
          
          const data = await response.json()
          console.log('API Response data:', data)
          
          // Check if the response has an error (backend might return error in JSON)
          if (data.error) {
            console.warn('Backend returned error:', data.error)
            throw new Error(`Backend error: ${data.error}`)
          }
          
          // Extract column C (index 2) from data array, skipping the first header row
          if (!data.data || !Array.isArray(data.data)) {
            throw new Error('Invalid API response format: missing data array')
          }
          
          const extractedAffirmations = data.data
            .slice(1) // Skip header row
            .map(row => row[2]) // Get column C (index 2)
            .filter(affirmation => affirmation && affirmation.trim() !== '') // Filter out empty values
          
          if (extractedAffirmations.length > 0) {
            console.log('Successfully loaded', extractedAffirmations.length, 'affirmations from API')
            setAffirmations(extractedAffirmations)
            setLoading(false)
            return
          } else {
            throw new Error('No affirmations found in API response')
          }
        } catch (apiError) {
          console.warn('API fetch failed, using local database:', apiError.message)
          // Fall through to use local database
        }
        
        // Fallback to local database.json
        if (localDatabase && localDatabase.affirmations && localDatabase.affirmations.length > 0) {
          setAffirmations(localDatabase.affirmations)
        } else {
          throw new Error('No affirmations available from API or local database')
        }
      } catch (err) {
        setError(err.message)
        console.error('Error loading affirmations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAffirmations()
  }, [])

  // Show buttons after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Shuffle affirmations when entering takeout page
  useEffect(() => {
    if (currentPage === 'takeout' && affirmations.length > 0) {
      const indices = Array.from({ length: affirmations.length }, (_, i) => i)
      // Shuffle array
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]]
      }
      setShuffledIndices(indices)
      setCurrentAffirmationIndex(0)
      setViewedIndices(new Set([indices[0]]))
    }
  }, [currentPage, affirmations])

  // Check if all affirmations have been viewed
  useEffect(() => {
    if (currentPage === 'takeout' && affirmations.length > 0 && viewedIndices.size === affirmations.length) {
      const timer = setTimeout(() => {
        setCurrentPage('completed')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [viewedIndices.size, currentPage, affirmations.length])

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

  // Loading state
  if (loading) {
    return (
      <div className="app-container">
        <div className="home-screen">
          <div className="initial-text">
            <p>Loading affirmations...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && affirmations.length === 0) {
    return (
      <div className="app-container">
        <div className="home-screen">
          <div className="initial-text">
            <p>Error loading affirmations: {error}</p>
            <p>Please check your connection or backend configuration.</p>
          </div>
        </div>
      </div>
    )
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
    if (shuffledIndices.length === 0 || affirmations.length === 0) {
      return null // Wait for shuffle to complete
    }
    const currentAffirmation = affirmations[shuffledIndices[currentAffirmationIndex]]

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
