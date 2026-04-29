from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
import io

# Brand Colors
BLUE = colors.HexColor('#1e3a5f')
LIGHT_BLUE = colors.HexColor('#2563eb')
GREEN = colors.HexColor('#16a34a')
RED = colors.HexColor('#dc2626')
GRAY = colors.HexColor('#6b7280')
LIGHT_GRAY = colors.HexColor('#f3f4f6')

def generate_sacs_pdf(data):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    client_name = data.get('clientName', '')
    quarter = data.get('quarter', '')
    inflow = data.get('inflow', 0)
    outflow = data.get('outflow', 0)
    excess = inflow - outflow
    private_reserve = data.get('privateReserveBalance', 0)
    private_reserve_target = data.get('privateReserveTarget', 0)

    # ── Header ──
    c.setFillColor(BLUE)
    c.rect(0, height - 80, width, 80, fill=1, stroke=0)

    c.setFillColor(colors.white)
    c.setFont('Helvetica-Bold', 20)
    c.drawString(40, height - 40, 'Windbrook Solutions')

    c.setFont('Helvetica', 11)
    c.drawString(40, height - 60, 'Simple Automated Cash Flow System (SACS)')

    c.setFont('Helvetica', 10)
    c.drawRightString(width - 40, height - 35, client_name)
    c.drawRightString(width - 40, height - 55, quarter)

    # ── Title ──
    c.setFillColor(BLUE)
    c.setFont('Helvetica-Bold', 16)
    c.drawCentredString(width / 2, height - 120, 'Monthly Cash Flow Overview')

    # ── Draw Bubble ──
    def draw_bubble(x, y, radius, fill_color, label, amount, label_color=colors.white):
        c.setFillColor(fill_color)
        c.circle(x, y, radius, fill=1, stroke=0)
        c.setFillColor(label_color)
        c.setFont('Helvetica-Bold', 11)
        c.drawCentredString(x, y + 12, label)
        c.setFont('Helvetica-Bold', 14)
        c.drawCentredString(x, y - 8, f'${amount:,.0f}')
        c.setFont('Helvetica', 9)
        c.drawCentredString(x, y - 24, 'per month')

    # ── Draw Arrow ──
    def draw_arrow(x1, y, x2, color, label=''):
        c.setStrokeColor(color)
        c.setLineWidth(2.5)
        c.line(x1, y, x2, y)
        # Arrowhead
        c.setFillColor(color)
        c.setStrokeColor(color)
        arrow_size = 8
        c.beginPath()
        c.moveTo(x2, y)
        c.lineTo(x2 - arrow_size, y + arrow_size / 2)
        c.lineTo(x2 - arrow_size, y - arrow_size / 2)
        c.closePath()
        c.drawPath(c._code and c._code or c.beginPath(), fill=1, stroke=0)
        if label:
            c.setFillColor(color)
            c.setFont('Helvetica-Bold', 9)
            c.drawCentredString((x1 + x2) / 2, y + 10, label)

    # Bubble positions
    bubble_y = height - 300
    bubble_r = 75
    inflow_x = 150
    outflow_x = width / 2
    reserve_x = width - 150

    # Draw bubbles
    draw_bubble(inflow_x, bubble_y, bubble_r, GREEN, 'INFLOW', inflow)
    draw_bubble(outflow_x, bubble_y, bubble_r, RED, 'OUTFLOW', outflow)
    draw_bubble(reserve_x, bubble_y, bubble_r, LIGHT_BLUE, 'PRIVATE', excess)

    # Draw arrows manually
    # Inflow → Outflow
    c.setStrokeColor(GRAY)
    c.setLineWidth(2.5)
    c.line(inflow_x + bubble_r, bubble_y, outflow_x - bubble_r, bubble_y)
    c.setFillColor(GRAY)
    c.setFont('Helvetica-Bold', 9)
    c.drawCentredString((inflow_x + bubble_r + outflow_x - bubble_r) / 2, bubble_y + 10, 'monthly expenses')

    # Outflow → Private Reserve
    c.setStrokeColor(LIGHT_BLUE)
    c.setLineWidth(2.5)
    c.line(outflow_x + bubble_r, bubble_y, reserve_x - bubble_r, bubble_y)
    c.setFillColor(LIGHT_BLUE)
    c.setFont('Helvetica-Bold', 9)
    c.drawCentredString((outflow_x + bubble_r + reserve_x - bubble_r) / 2, bubble_y + 10, 'excess savings')

    # ── Summary Box ──
    box_y = height - 460
    box_x = 60
    box_w = width - 120
    box_h = 110

    c.setFillColor(LIGHT_GRAY)
    c.roundRect(box_x, box_y, box_w, box_h, 10, fill=1, stroke=0)

    # Summary rows
    summary_items = [
        ('Monthly Inflow', f'${inflow:,.0f}', GREEN),
        ('Monthly Outflow', f'${outflow:,.0f}', RED),
        ('Monthly Excess', f'${excess:,.0f}', LIGHT_BLUE),
    ]

    col_w = box_w / 3
    for i, (label, value, color) in enumerate(summary_items):
        cx = box_x + col_w * i + col_w / 2
        c.setFillColor(GRAY)
        c.setFont('Helvetica', 9)
        c.drawCentredString(cx, box_y + box_h - 25, label)
        c.setFillColor(color)
        c.setFont('Helvetica-Bold', 16)
        c.drawCentredString(cx, box_y + box_h - 55, value)

    # Dividers
    c.setStrokeColor(colors.HexColor('#e5e7eb'))
    c.setLineWidth(1)
    c.line(box_x + col_w, box_y + 10, box_x + col_w, box_y + box_h - 10)
    c.line(box_x + col_w * 2, box_y + 10, box_x + col_w * 2, box_y + box_h - 10)

    # ── Private Reserve Section ──
    pr_y = height - 590
    c.setFillColor(BLUE)
    c.setFont('Helvetica-Bold', 13)
    c.drawString(60, pr_y + 10, 'Private Reserve Account')

    c.setFillColor(LIGHT_GRAY)
    c.roundRect(60, pr_y - 70, box_w, 70, 8, fill=1, stroke=0)

    pr_items = [
        ('Current Balance', f'${private_reserve:,.0f}'),
        ('Target Balance', f'${private_reserve_target:,.0f}'),
        ('Difference', f'${private_reserve - private_reserve_target:,.0f}'),
    ]

    for i, (label, value) in enumerate(pr_items):
        cx = 60 + col_w * i + col_w / 2
        c.setFillColor(GRAY)
        c.setFont('Helvetica', 9)
        c.drawCentredString(cx, pr_y - 20, label)
        c.setFillColor(BLUE)
        c.setFont('Helvetica-Bold', 14)
        c.drawCentredString(cx, pr_y - 45, value)

    # ── Footer ──
    c.setFillColor(LIGHT_GRAY)
    c.rect(0, 0, width, 40, fill=1, stroke=0)
    c.setFillColor(GRAY)
    c.setFont('Helvetica', 8)
    c.drawCentredString(width / 2, 15, 'Windbrook Solutions — Confidential — For Client Use Only')

    c.save()
    buffer.seek(0)
    return buffer