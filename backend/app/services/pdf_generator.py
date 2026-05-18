from reportlab.platypus import SimpleDocTemplate, Paragraph

def generate_pdf(content, filename="resume.pdf"):
    doc = SimpleDocTemplate(filename)
    elements = []

    elements.append(Paragraph(content))

    doc.build(elements)
    return filename