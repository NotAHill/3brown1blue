import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError(null)
    } else {
      setError('Please select a PDF file')
      setFile(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !topic.trim()) return

    setLoading(true)
    setError(null)
    setResponse(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('topic', topic.trim())

    try {
      const result = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setResponse(result.data)
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while uploading the file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>PDF Topic Extractor</h1>
      <form onSubmit={handleSubmit}>
        <div className="upload-container">
          <div className="input-group">
            <label htmlFor="topic">Topic to search for:</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic to search for"
              className="topic-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="file">Select PDF:</label>
            <input
              type="file"
              id="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
          <button 
            type="submit" 
            disabled={!file || !topic.trim() || loading} 
            className="upload-button"
          >
            Process PDF
          </button>
        </div>
      </form>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Analyzing your PDF...</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}
      
      {response && (
        <div className="success">
          <h3>Results</h3>
          <p>{response.message}</p>
          <p>File: {response.filename}</p>
          <p>Topic: {response.topic}</p>
          <div className="relevant-pages">
            <h4>Relevant Pages:</h4>
            {response.relevant_pages.length > 0 ? (
              <ul>
                {response.relevant_pages.map((page) => (
                  <li key={page}>Page {page}</li>
                ))}
              </ul>
            ) : (
              <p>No specific pages found containing the topic.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
