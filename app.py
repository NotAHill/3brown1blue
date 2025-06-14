from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import random

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not file.filename.endswith('.pdf'):
        return jsonify({'error': 'File must be a PDF'}), 400
    
    # Simulate processing time
    time.sleep(3)
    
    # Generate a random code
    code = random.randint(1000, 9999)
    
    return jsonify({
        'message': 'File processed successfully',
        'filename': file.filename,
        'code': code
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000) 