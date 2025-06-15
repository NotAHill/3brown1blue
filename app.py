from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import random
import os
from dotenv import load_dotenv
from pdf_processor import GeminiProcessor, PDFProcessor
from io import BytesIO
from PyPDF2 import PdfReader
from flask_caching import Cache
import tempfile
import uuid


# Load environment variables
load_dotenv()

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
CORS(app)

logger = logging.getLogger(__name__)

# Initialize the PDF processor with Gemini
pdf_processor = PDFProcessor(
    GeminiProcessor(api_key=os.getenv('GEMINI_API_KEY'))
)

# Dictionary to store temporary file information
temp_files = {}

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['pdf_filename']
    
    if not file.filename.endswith('.pdf'):
        return jsonify({'error': 'File must be a PDF'}), 400
    
    try:
        # Create a temporary file
        temp_dir = tempfile.mkdtemp()
        temp_path = os.path.join(temp_dir, f"{uuid.uuid4()}.pdf")
        
        # Save the uploaded file
        file.save(temp_path)
        
        # Generate a unique code for this file
        file_code = str(uuid.uuid4())
        
        # Store the file information
        temp_files[file_code] = {
            'path': temp_path,
            'original_filename': file.filename
        }
        
        return jsonify({
            'message': 'PDF uploaded successfully',
            'code': file_code,
            'filename': file.filename
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@app.route('/process/<file_code>', methods=['GET'])
def process_file(file_code):
    if file_code not in temp_files:
        return jsonify({'error': 'Invalid file code'}), 404
    
    file_info = temp_files[file_code]
    
    try:
        # Process the PDF
        with open(file_info['path'], 'rb') as pdf_file:
            result = pdf_processor.process_pdf(pdf_file, file_info['topic'])
        
        if not result.is_valid:
            return jsonify({'error': result.error_message}), 400
        
        return jsonify({
            'message': 'PDF processed successfully',
            'filename': file_info['original_filename'],
            'topic': file_info['topic'],
            'relevant_pages': result.relevant_pages
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500
    finally:
        # Clean up the temporary file
        try:
            os.remove(file_info['path'])
            os.rmdir(os.path.dirname(file_info['path']))
            del temp_files[file_code]
        except:
            pass

if __name__ == '__main__':
    app.run(debug=True, port=5000) 