from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pdf_generators.sacs import generate_sacs_pdf
from pdf_generators.tcc import generate_tcc_pdf
import io

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/generate/sacs', methods=['POST'])
def generate_sacs():
    data = request.get_json()
    pdf_buffer = generate_sacs_pdf(data)
    return send_file(
        pdf_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f"SACS_{data['clientName'].replace(' ', '_')}.pdf"
    )

@app.route('/generate/tcc', methods=['POST'])
def generate_tcc():
    data = request.get_json()
    pdf_buffer = generate_tcc_pdf(data)
    return send_file(
        pdf_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f"TCC_{data['clientName'].replace(' ', '_')}.pdf"
    )

if __name__ == '__main__':
    app.run(debug=True, port=5000)