from flask import Flask, render_template, request, send_file
import pandas as pd
import camelot
import os
import img2pdf

app = Flask(__name__)

UPLOAD_FOLDER = "C:\\Users\\Cmisu08\\Desktop\\PYTHON\\sandboxing\\Tool\\uploads"
if not os.path.exists(UPLOAD_FOLDER):   
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index():
    return render_template('index1.html')

@app.route('/uploads', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file part"
    
    file = request.files['file']
    
    if file.filename == '':
        return "No selected file"

    # Save uploaded file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Convert PDF to Excel
    tables = camelot.read_pdf(file_path, pages='all', flavor="stream")
    excel_path = os.path.join(UPLOAD_FOLDER, "converted.xlsx")

    with pd.ExcelWriter(excel_path) as writer:
        for i, table in enumerate(tables):
            df=table.df
            print(df)
            df.columns = df.iloc[0]  # Assign first row as column headers
            df = df[1:]
            df.to_excel(writer, sheet_name=f"Table_{i+1}", index=False)

    return send_file(excel_path, as_attachment=True)

@app.route('/convert_img_to_pdf', methods=['POST'])
def uploadImages():
    if 'files' not in request.files:
        return "No file part"
    
    files = request.files.getlist('files')  # Get multiple files
    
    if len(files) == 0:
        return "No selected files"

    img_paths = []
    
    # Save all images and store their paths
    for file in files:
        if file.filename == '':
            continue
        img_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(img_path)
        img_paths.append(img_path)

    if len(img_paths) == 0:
        return "No valid images uploaded"

    # Convert multiple images to a single PDF
    pdf_path = os.path.join(UPLOAD_FOLDER, "converted.pdf")
    with open(pdf_path, "wb") as f:
        f.write(img2pdf.convert(img_paths))

    return send_file(pdf_path, as_attachment=True)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)

