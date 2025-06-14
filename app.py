from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import os
from dotenv import load_dotenv
from pdf_processor import GeminiProcessor, PDFProcessor

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize the PDF processor with Gemini
pdf_processor = PDFProcessor(
    GeminiProcessor(api_key=os.getenv('GEMINI_API_KEY'))
)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    if 'topic' not in request.form:
        return jsonify({'error': 'No topic provided'}), 400
    
    file = request.files['file']
    topic = request.form['topic']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not file.filename.endswith('.pdf'):
        return jsonify({'error': 'File must be a PDF'}), 400
    
    # Process the PDF
    result = pdf_processor.process_pdf(file, topic)
    
    if not result.is_valid:
        return jsonify({'error': result.error_message}), 400
    
    return jsonify({
        'message': 'PDF processed successfully',
        'filename': file.filename,
        'topic': topic,
        'relevant_pages': result.relevant_pages
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000) 