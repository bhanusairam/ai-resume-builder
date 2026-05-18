from docx import Document

def create_docx(content):
    doc = Document()
    doc.add_paragraph(content)
    file = "resume.docx"
    doc.save(file)
    return file