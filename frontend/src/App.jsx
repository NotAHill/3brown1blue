import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
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
    if (!file) return

    setLoading(true)
    setError(null)
    setResponse(null)

    const formData = new FormData()
    formData.append('file', file)

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
      <h1>PDF Upload</h1>
      <form onSubmit={handleSubmit}>
        <div className="upload-container">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="file-input"
          />
          <button type="submit" disabled={!file || loading} className="upload-button">
            Upload PDF
          </button>
        </div>
      </form>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Processing your PDF...</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}
      
      {response && (
        <div className="success">
          <p>{response.message}</p>
          <p>File: {response.filename}</p>
        </div>
      )}
    </div>
  )
}

export default App
