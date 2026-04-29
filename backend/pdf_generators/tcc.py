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
DARK_GRAY = colors.HexColor('#374151')

def generate_tcc_pdf(data):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    client_name = data.get('clientName', '')
    quarter = data.get('quarter', '')
    client1_name = data.get('client1Name', '')
    client2_name = data.get('client2Name', '')
    client1_dob = data.get('client1DOB', '')
    client2_dob = data.get('client2DOB', '')
    client1_age = data.get('client1Age', '')
    client2_age = data.get('client2Age', '')
    client1_ssn = data.get('client1SSN', '')
    client2_ssn = data.get('client2SSN', '')

    retirement_accounts = data.get('retirementAccounts', [])
    non_retirement_accounts = data.get('nonRetirementAccounts', [])
    liabilities = data.get('liabilities', [])
    trust = data.get('trust', None)

    # ── Calculations ──
    client1_retirement = [a for a in retirement_accounts if a.get('owner') == 'client1']
    client2_retirement = [a for a in retirement_accounts if a.get('owner') == 'client2']

    client1_total = sum(a.get('balance', 0) for a in client1_retirement)
    client2_total = sum(a.get('balance', 0) for a in client2_retirement)
    non_retirement_total = sum(a.get('balance', 0) for a in non_retirement_accounts)
    trust_value = trust.get('value', 0) if trust else 0
    grand_total = client1_total + client2_total + non_retirement_total + trust_value
    liabilities_total = sum(a.get('balance', 0) for a in liabilities)

    # ── Header ──
    c.setFillColor(BLUE)
    c.rect(0, height - 80, width, 80, fill=1, stroke=0)

    c.setFillColor(colors.white)
    c.setFont('Helvetica-Bold', 20)
    c.drawString(40, height - 40, 'Windbrook Solutions')

    c.setFont('Helvetica', 11)
    c.drawString(40, height - 60, 'Total Client Chart (TCC) — Net Worth Overview')

    c.setFont('Helvetica', 10)
    c.drawRightString(width - 40, height - 35, client_name)
    c.drawRightString(width - 40, height - 55, quarter)

    # ── Helper: Draw Account Bubble ──
    def draw_account_bubble(x, y, w, h, account_type, last_four, balance, color=LIGHT_BLUE):
        c.setFillColor(color)
        c.roundRect(x, y, w, h, 8, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont('Helvetica-Bold', 9)
        c.drawCentredString(x + w / 2, y + h - 16, account_type)
        c.setFont('Helvetica', 8)
        c.drawCentredString(x + w / 2, y + h - 28, f'••••{last_four}')
        c.setFont('Helvetica-Bold', 11)
        c.drawCentredString(x + w / 2, y + h - 45, f'${balance:,.0f}')

    # ── Helper: Draw Summary Box ──
    def draw_summary_box(x, y, w, h, label, value):
        c.setFillColor(colors.HexColor('#e5e7eb'))
        c.roundRect(x, y, w, h, 6, fill=1, stroke=0)
        c.setFillColor(GRAY)
        c.setFont('Helvetica', 8)
        c.drawCentredString(x + w / 2, y + h - 16, label)
        c.setFillColor(BLUE)
        c.setFont('Helvetica-Bold', 12)
        c.drawCentredString(x + w / 2, y + h - 34, f'${value:,.0f}')

    # ── Helper: Draw Client Info Bubble ──
    def draw_client_info(x, y, w, h, name, dob, age, ssn):
        c.setFillColor(GREEN)
        c.roundRect(x, y, w, h, 8, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont('Helvetica-Bold', 10)
        c.drawCentredString(x + w / 2, y + h - 16, name)
        c.setFont('Helvetica', 8)
        c.drawCentredString(x + w / 2, y + h - 28, f'DOB: {dob}  |  Age: {age}')
        c.drawCentredString(x + w / 2, y + h - 40, f'SSN: ••••{ssn}')

    bubble_w = 120
    bubble_h = 55
    summary_h = 45
    col_gap = 15
    section_y = height - 110

    # ── Client Info Bubbles ──
    draw_client_info(40, section_y - 50, 200, 50, client1_name, client1_dob, client1_age, client1_ssn)
    if client2_name:
        draw_client_info(width - 240, section_y - 50, 200, 50, client2_name, client2_dob, client2_age, client2_ssn)

    # ── Client 1 Retirement ──
    section_y = height - 190
    c.setFillColor(BLUE)
    c.setFont('Helvetica-Bold', 10)
    c.drawString(40, section_y, f'{client1_name} — Retirement Accounts')

    acc_x = 40
    for acc in client1_retirement:
        draw_account_bubble(acc_x, section_y - bubble_h - 10, bubble_w, bubble_h,
                          acc.get('type', ''), acc.get('lastFour', ''), acc.get('balance', 0), LIGHT_BLUE)
        acc_x += bubble_w + col_gap

    draw_summary_box(acc_x, section_y - summary_h - 10, 130, summary_h,
                    f'{client1_name} Retirement Total', client1_total)

    # ── Client 2 Retirement ──
    if client2_retirement:
        section_y = section_y - bubble_h - 40
        c.setFillColor(BLUE)
        c.setFont('Helvetica-Bold', 10)
        c.drawString(40, section_y, f'{client2_name} — Retirement Accounts')

        acc_x = 40
        for acc in client2_retirement:
            draw_account_bubble(acc_x, section_y - bubble_h - 10, bubble_w, bubble_h,
                              acc.get('type', ''), acc.get('lastFour', ''), acc.get('balance', 0), LIGHT_BLUE)
            acc_x += bubble_w + col_gap

        draw_summary_box(acc_x, section_y - summary_h - 10, 130, summary_h,
                        f'{client2_name} Retirement Total', client2_total)

    # ── Non-Retirement Accounts ──
    section_y = section_y - bubble_h - 40
    c.setFillColor(BLUE)
    c.setFont('Helvetica-Bold', 10)
    c.drawString(40, section_y, 'Non-Retirement Accounts')

    acc_x = 40
    for acc in non_retirement_accounts:
        draw_account_bubble(acc_x, section_y - bubble_h - 10, bubble_w, bubble_h,
                          acc.get('type', ''), acc.get('lastFour', ''), acc.get('balance', 0),
                          colors.HexColor('#7c3aed'))
        acc_x += bubble_w + col_gap

    draw_summary_box(acc_x, section_y - summary_h - 10, 130, summary_h,
                    'Non-Retirement Total', non_retirement_total)

    # ── Trust ──
    if trust:
        section_y = section_y - bubble_h - 40
        c.setFillColor(BLUE)
        c.setFont('Helvetica-Bold', 10)
        c.drawString(40, section_y, 'Trust')

        c.setFillColor(colors.HexColor('#059669'))
        c.roundRect(40, section_y - bubble_h - 10, 200, bubble_h, 8, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont('Helvetica-Bold', 9)
        c.drawCentredString(140, section_y - 10 - 16, 'Primary Residence')
        c.setFont('Helvetica', 8)
        c.drawCentredString(140, section_y - 10 - 28, trust.get('address', ''))
        c.setFont('Helvetica-Bold', 11)
        c.drawCentredString(140, section_y - 10 - 45, f'${trust_value:,.0f}')

    # ── Liabilities ──
    if liabilities:
        section_y = section_y - bubble_h - 40
        c.setFillColor(BLUE)
        c.setFont('Helvetica-Bold', 10)
        c.drawString(40, section_y, 'Liabilities')

        acc_x = 40
        for lib in liabilities:
            c.setFillColor(RED)
            c.roundRect(acc_x, section_y - bubble_h - 10, bubble_w, bubble_h, 8, fill=1, stroke=0)
            c.setFillColor(colors.white)
            c.setFont('Helvetica-Bold', 9)
            c.drawCentredString(acc_x + bubble_w / 2, section_y - 10 - 16, lib.get('type', ''))
            c.setFont('Helvetica', 8)
            c.drawCentredString(acc_x + bubble_w / 2, section_y - 10 - 28, f'{lib.get("interestRate", "")}% interest')
            c.setFont('Helvetica-Bold', 11)
            c.drawCentredString(acc_x + bubble_w / 2, section_y - 10 - 45, f'${lib.get("balance", 0):,.0f}')
            acc_x += bubble_w + col_gap

        draw_summary_box(acc_x, section_y - summary_h - 10, 130, summary_h,
                        'Liabilities Total', liabilities_total)

    # ── Grand Total ──
    c.setFillColor(BLUE)
    c.roundRect(40, 55, width - 80, 50, 8, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont('Helvetica-Bold', 11)
    c.drawCentredString(width / 2, 90, 'GRAND TOTAL NET WORTH')
    c.setFont('Helvetica-Bold', 18)
    c.drawCentredString(width / 2, 68, f'${grand_total:,.0f}')

    # ── Footer ──
    c.setFillColor(LIGHT_GRAY)
    c.rect(0, 0, width, 40, fill=1, stroke=0)
    c.setFillColor(GRAY)
    c.setFont('Helvetica', 8)
    c.drawCentredString(width / 2, 15, 'Windbrook Solutions — Confidential — For Client Use Only')

    c.save()
    buffer.seek(0)
    return buffer