#!/usr/bin/env python3
"""Generate the SYMBA T4.6 consortium deck (content of 2026-10-18, after the rebuild).

Approximates the SYMBA visual identity (white/blue/green, EU footer); it is
NOT the official template. For pixel-fidelity, paste the content of
COWORK_SCRIPT_DETAILED.md into the branded SYMBA_T46_GA_v9.pptx master.
The slides here are the same seven, in the same order, as the cowork script
and SPEAKER_TRACK_EN.md; change them together.

Usage:
    python docs/presentation/build_deck.py [output.pptx]
Default output: docs/presentation/SYMBA_T46_GA_corrected.pptx (git-ignored).
Screenshots are read from screenshots/ (01-home.png ... 05-about.png); a
missing one is skipped.
"""
import os
import sys

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Inches, Pt

HERE = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(HERE, "screenshots")

BLUE       = RGBColor(0x29, 0xAB, 0xE2)
DARKBLUE   = RGBColor(0x16, 0x4A, 0x6B)
TEXTBLUE   = RGBColor(0x1F, 0x5C, 0x83)
GREEN      = RGBColor(0x8D, 0xC6, 0x3F)
GREENFILL  = RGBColor(0xEC, 0xF5, 0xDC)
YELLOW     = RGBColor(0xC5, 0xD9, 0x2D)
GREY       = RGBColor(0x4A, 0x4A, 0x4A)
LIGHTBLUE  = RGBColor(0xE6, 0xF3, 0xFB)
WHITE      = RGBColor(0xFF, 0xFF, 0xFF)

prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]
SW, SH = prs.slide_width, prs.slide_height


def textbox(slide, x, y, w, h, anchor=MSO_ANCHOR.TOP):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame; tf.word_wrap = True; tf.vertical_anchor = anchor
    return tf


def para(tf, text, size, color, bold=False, bullet=False, space_after=6,
         first=False, align=PP_ALIGN.LEFT):
    p = tf.paragraphs[0] if first and not tf.paragraphs[0].runs else tf.add_paragraph()
    p.alignment = align; p.space_after = Pt(space_after)
    if bullet:
        r = p.add_run(); r.text = "—  "
        r.font.size = Pt(size); r.font.color.rgb = GREEN; r.font.bold = True
    r = p.add_run(); r.text = text
    r.font.size = Pt(size); r.font.color.rgb = color; r.font.bold = bold
    r.font.name = "Calibri"
    return p


def banner(slide, title):
    bar = slide.shapes.add_shape(MSO_SHAPE.PENTAGON, Inches(0.0), Inches(0.18),
                                 Inches(11.0), Inches(0.85))
    bar.fill.solid(); bar.fill.fore_color.rgb = BLUE; bar.line.fill.background()
    tf = bar.text_frame; tf.margin_left = Inches(0.45)
    p = tf.paragraphs[0]; r = p.add_run(); r.text = title
    r.font.size = Pt(26); r.font.bold = True; r.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.LEFT; tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    # SYMBA wordmark (text stand-in for logo)
    logo = textbox(slide, Inches(11.3), Inches(0.18), Inches(1.9), Inches(0.85),
                   MSO_ANCHOR.MIDDLE)
    p = logo.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = "SYM"; r.font.size = Pt(28); r.font.bold = True
    r.font.color.rgb = BLUE
    r2 = p.add_run(); r2.text = "BA"; r2.font.size = Pt(28); r2.font.bold = True
    r2.font.color.rgb = GREEN


def footer(slide):
    ln = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.5), Inches(6.78),
                                Inches(12.33), Pt(2.2))
    ln.fill.solid(); ln.fill.fore_color.rgb = YELLOW; ln.line.fill.background()
    tf = textbox(slide, Inches(0.5), Inches(6.9), Inches(9.5), Inches(0.5))
    para(tf, "Funded by the European Union — Horizon Europe R&I Programme · "
             "Grant Agreement N. 101135562", 9, GREY, first=True)
    tf2 = textbox(slide, Inches(10.2), Inches(6.9), Inches(2.9), Inches(0.5))
    para(tf2, "www.symbaproject.eu", 9, TEXTBLUE, bold=True, first=True,
         align=PP_ALIGN.RIGHT)


def green_box(slide, x, y, w, h):
    b = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
    b.fill.solid(); b.fill.fore_color.rgb = GREENFILL
    b.line.color.rgb = GREEN; b.line.width = Pt(1.25)
    b.shadow.inherit = False
    return b


def blue_box(slide, x, y, w, h):
    b = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
    b.fill.solid(); b.fill.fore_color.rgb = LIGHTBLUE
    b.line.color.rgb = BLUE; b.line.width = Pt(1.0); b.shadow.inherit = False
    return b


def lead(slide, text):
    tf = textbox(slide, Inches(0.5), Inches(1.2), Inches(12.3), Inches(0.55))
    para(tf, text, 15, DARKBLUE, bold=True, first=True)


def picture(slide, name, x, y, max_w, max_h, top=0.0):
    """Place screenshots/<name> inside the box (x, y, max_w, max_h), keeping its
    aspect ratio. The screenshots are full pages: `top` (fraction of the height)
    drops the part above it, and a page taller than the box is cut at the bottom
    so that it fills the box instead of shrinking to a sliver. Skipped if the
    file is missing."""
    path = os.path.join(SHOTS, name)
    if not os.path.exists(path):
        return None
    pic = slide.shapes.add_picture(path, x, y)
    w, h = pic.width, pic.height
    visible = 1.0 - top
    box_ratio = max_h / max_w
    if h * visible / w > box_ratio:
        pic.crop_top = top
        pic.crop_bottom = 1.0 - top - (w * box_ratio) / h
        pic.width, pic.height = int(max_w), int(max_h)
        pic.left, pic.top = int(x), int(y)
    else:
        pic.crop_top = top
        h = h * visible
        scale = min(max_w / w, max_h / h)
        pic.width = int(w * scale); pic.height = int(h * scale)
        pic.left = int(x + (max_w - pic.width) / 2); pic.top = int(y + (max_h - pic.height) / 2)
    pic.line.color.rgb = BLUE; pic.line.width = Pt(0.75)
    return pic


def bullets(tf, items, size=13, color=GREY, space_after=6):
    for i, text in enumerate(items):
        para(tf, text, size, color, bullet=True, first=(i == 0), space_after=space_after)


def notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text


# ===================================================================== SLIDE 1
s = prs.slides.add_slide(BLANK)
top = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SW, Inches(0.35))
top.fill.solid(); top.fill.fore_color.rgb = BLUE; top.line.fill.background()
tf = textbox(s, Inches(0.6), Inches(1.4), Inches(6.2), Inches(1.0))
p = tf.paragraphs[0]
r = p.add_run(); r.text = "SYM"; r.font.size = Pt(40); r.font.bold = True; r.font.color.rgb = BLUE
r = p.add_run(); r.text = "BA"; r.font.size = Pt(40); r.font.bold = True; r.font.color.rgb = GREEN
r = p.add_run(); r.text = "  T4.6"; r.font.size = Pt(40); r.font.bold = True
r.font.color.rgb = DARKBLUE
tf = textbox(s, Inches(0.6), Inches(2.45), Inches(6.2), Inches(3.6))
para(tf, "Monitoring & Reporting System for Industrial Symbiosis", 24, DARKBLUE,
     bold=True, first=True, space_after=14)
para(tf, "Configuring industrial-symbiosis studies on the variables of D4.1 and D4.2",
     17, TEXTBLUE, space_after=18)
para(tf, "WP4 · Task 4.6 · Deliverable D4.6 · ENCO, with CIRCE and CET", 13, GREY,
     space_after=6)
para(tf, "biobasedisadvisor.symbaproject.eu", 13, TEXTBLUE, bold=True)
picture(s, "01-home.png", Inches(7.1), Inches(1.0), Inches(5.8), Inches(5.5))
footer(s)
notes(s, "This is the tool of Task 4.6, deliverable D4.6, led by ENCO with CIRCE and CET. "
         "It is not an LCA or LCC calculator: it computes no kilograms of CO2 equivalent, "
         "no net present value, no social indicator; those numbers come from the partners "
         "of T4.1 to T4.3. It takes an industrial-symbiosis case and returns the "
         "methodological configuration that D4.1 (LCA, Part 1 and the sector chapters of "
         "Part 2) and D4.2 (LCC) require for it, together with the data to collect. On "
         "18 October we rebuilt it so that its questions are the variables the "
         "deliverables actually use.")

# ===================================================================== SLIDE 2
s = prs.slides.add_slide(BLANK)
banner(s, "The problem: the set-up is fixed before any number")
lead(s, "D4.1 and D4.2 make the modelling depend on a few case variables.")
tf = textbox(s, Inches(0.5), Inches(1.95), Inches(7.4), Inches(3.4))
bullets(tf, [
    "ILCD situation follows the decision and its scale (D4.1 Table 1)",
    "Reference scenario follows whether exchanges already run (D4.1 §11.1)",
    "One study horizon for LCA and LCC (D4.2 §11)",
    "Societal LCC follows the decision-maker's perspective (D4.2 §2.2-2.3)",
    "Functional unit follows what is compared (D4.1 Part 2)",
], size=15, color=TEXTBLUE, space_after=12)
green_box(s, Inches(8.25), Inches(1.95), Inches(4.55), Inches(3.1))
tf = textbox(s, Inches(8.55), Inches(2.15), Inches(3.95), Inches(2.7))
para(tf, "e.g.", 13, GREEN, bold=True, first=True, space_after=8)
para(tf, "Same residue, opposite attribution:", 14, DARKBLUE, bold=True, space_after=8)
para(tf, "sender pays → waste, zero burden.", 13, GREY, space_after=4)
para(tf, "Receiver pays → co-product, substitution (D4.1 §8.3).", 13, GREY)
bb = blue_box(s, Inches(0.5), Inches(5.55), Inches(12.33), Inches(0.95))
tf = bb.text_frame; tf.word_wrap = True
para(tf, "Two analysts, two set-ups: results that cannot be compared.", 15, DARKBLUE,
     bold=True, first=True, align=PP_ALIGN.CENTER)
footer(s)
notes(s, "The hard part of an LCSA of a symbiosis is not the arithmetic, it is fixing the "
         "set-up first. Our deliverables say what drives it: the ILCD situation follows the "
         "decision and the scale of its consequences (D4.1 Table 1), the reference scenario "
         "follows whether the exchanges already take place (D4.1 §11.1), LCA and LCC share "
         "one horizon (D4.2 §11), the societal LCC follows the decision-maker (D4.2 "
         "§2.2-2.3), the functional unit follows what is compared (D4.1 Part 2). Left "
         "implicit, two competent analysts configure the same case differently. Who pays "
         "whom for a flow decides whether it enters with zero burden or as a co-product with "
         "substitution. The earlier version routed cases on five T4.6 'pathways' that the "
         "deliverables do not know; that is what we removed.")

# ===================================================================== SLIDE 3
s = prs.slides.add_slide(BLANK)
banner(s, "The questions are the deliverables' variables")
lead(s, "Three parts, numbered on screen; required: Q3, Q9, Q1, Q10 with LCC.")
parts = [
    ("The study", [
        ("Q0", "Kind of study: analysis … restructuring (D4.1 §4.3.2)"),
        ("Q1", "Subject: describes the network form and boundary"),
        ("Q3", "Dimensions: environmental, economic, social"),
        ("Q9", "Decision and scale → ILCD A, B, C1, C2"),
        ("Q2", "Exchanges already running? → HNSRS or CNSRS (D4.1 §11.1)"),
        ("Q8", "One horizon: operating year, analysis period, asset lifetime"),
        ("Q6b", "TRL of the key technology"),
        ("Q10", "Public objective or decision-maker → societal LCC"),
        ("Q4", "Use: public comparative claim, EU policy alignment"),
        ("Q11", "What is compared → basis of the functional unit"),
    ]),
    ("The exchanges", [
        ("Q5", "Per flow: who pays whom, interdependence"),
        ("", "Optional per flow: sellable elsewhere, Part 2 sector, configuration"),
        ("Q7", "Concentration of key interactions → regionalised LCIA"),
        ("Q7b", "Reference market: region and scope (D4.1 §11.3.1)"),
        ("Q12", "New dedicated shared assets → CAPEX/OPEX shared (D4.2 §4.2)"),
    ]),
    ("Description", [
        ("Q6a", "Company sector: describes only"),
    ]),
]
tf = textbox(s, Inches(0.5), Inches(1.8), Inches(7.9), Inches(4.9))
first = True
for title, rows in parts:
    para(tf, title, 13, BLUE, bold=True, first=first, space_after=2)
    first = False
    for code, text in rows:
        p = tf.add_paragraph(); p.space_after = Pt(1)
        r = p.add_run(); r.text = (code + "  ") if code else "      "
        r.font.size = Pt(11); r.font.bold = True; r.font.color.rgb = DARKBLUE
        r.font.name = "Calibri"
        r = p.add_run(); r.text = text
        r.font.size = Pt(11); r.font.color.rgb = GREY; r.font.name = "Calibri"
    tf.paragraphs[-1].space_after = Pt(7)
picture(s, "02-questionnaire.png", Inches(8.6), Inches(1.8), Inches(4.25), Inches(4.85))
footer(s)
notes(s, "Three parts. The study: Q9 decides the ILCD situation as in D4.1 Table 1: micro "
         "effects give A; structural effects give B only with a documented market screening "
         "of about one per cent of new capacity (D4.1 §11.3.1); if it is denied, A with B "
         "as a sensitivity; documenting a network gives C1; strict reporting of one company gives "
         "C2. Q2: exchanges already running give the hypothetical reference HNSRS (each firm today "
         "without the links), not yet the current-situation CNSRS (D4.1 §11.1); a long-standing network gets a modern "
         "counterfactual (§11.2.2). Q8 sets one horizon for LCA and LCC; a future operating "
         "year, a TRL below 7 or a horizon beyond fifteen years (adjustable) adds future "
         "background (SSP/RCP). Q10 adds the societal LCC (D4.2 §2.2-2.3). Q4 C, a public "
         "comparative claim, brings panel review and no weighting; Q4 D brings PEF with the "
         "Circular Footprint Formula and EF 3.1. Q11 sets the functional unit. The exchanges: "
         "Q5 per flow; Q7 sets the regionalised characterisation (D4.1 §12.2.3, §12.3.3), "
         "with transport explicit for every exchange; Q7b the reference market; Q12 shared "
         "assets (D4.2 §4.2, D4.1 §6.3.3). Q1 and Q6a describe the case. The codes are kept "
         "because saved cases, tests and schemas use them.")

# ===================================================================== SLIDE 4
s = prs.slides.add_slide(BLANK)
banner(s, "Engine: schema-driven, answers to nodes")
lead(s, "The methodology lives in versioned JSON schemas, not in code.")
stages = [("L0", "derived\nstates"), ("L1", "blocks"), ("Activate", "nodes"),
          ("Part 2", "sector\nrules"), ("L2", "obligations"), ("L3", "decision\npoints")]
x = 0.5; cw = 2.0; gap = 0.04
for tag, sub in stages:
    ch = s.shapes.add_shape(MSO_SHAPE.CHEVRON, Inches(x), Inches(1.9),
                            Inches(cw), Inches(1.05))
    ch.fill.solid(); ch.fill.fore_color.rgb = BLUE; ch.line.fill.background()
    ch.shadow.inherit = False
    tf = ch.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = tag; r.font.bold = True; r.font.size = Pt(14)
    r.font.color.rgb = WHITE
    p2 = tf.add_paragraph(); p2.alignment = PP_ALIGN.CENTER
    r = p2.add_run(); r.text = sub; r.font.size = Pt(9.5); r.font.color.rgb = WHITE
    x += cw + gap
cards = [
    ("186", "atomic nodes", "LCA 59 · LCC 61 · S-LCA 66\n95 fielded · 91 procedural mandates", BLUE),
    ("64", "D4.1 Part 2 sector rules", "5 chapters (§4-§8)\n26 typical configurations", BLUE),
    ("12", "critical decision points", "shown when all their\nmethods are on", GREEN),
]
x = 0.6
for big, mid, small, col in cards:
    cb = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(3.2),
                            Inches(3.9), Inches(1.75))
    cb.fill.solid(); cb.fill.fore_color.rgb = WHITE
    cb.line.color.rgb = BLUE; cb.line.width = Pt(1.0); cb.shadow.inherit = False
    tf = cb.text_frame; tf.word_wrap = True; tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = big; r.font.bold = True; r.font.size = Pt(34)
    r.font.color.rgb = col
    p2 = tf.add_paragraph(); p2.alignment = PP_ALIGN.CENTER
    r = p2.add_run(); r.text = mid; r.font.bold = True; r.font.size = Pt(14)
    r.font.color.rgb = DARKBLUE
    p3 = tf.add_paragraph(); p3.alignment = PP_ALIGN.CENTER
    r = p3.add_run(); r.text = small; r.font.size = Pt(10.5); r.font.color.rgb = GREY
    x += 4.05
tf = textbox(s, Inches(0.6), Inches(5.15), Inches(12.1), Inches(1.5))
bullets(tf, [
    "Branch keys pick a node's value from the answers",
    "Answer-dependent phrases fill reference market, interactions, shared assets",
    "Notes flag contradictions; never change an answer silently",
], size=13, color=TEXTBLUE, space_after=4)
footer(s)
notes(s, "L0 derives three states: the ILCD situation from Q9, the LCC type from Q3, the "
         "situation and Q10, and the S-LCA state. L1 checks four blocking combinations. "
         "Activation goes through 186 atomic nodes extracted from D4.1, D4.2 and D4.3; a "
         "discriminative node has one value per branch key, such as ilcd=C2 or lcc_type=C+N, "
         "and the first match wins. Where an answer is orthogonal to the branches, the node "
         "text carries a placeholder filled from the answer: the reference market from Q7b, "
         "the scale of interactions from Q7, shared assets from Q12. The D4.1 Part 2 sector "
         "rules come next, listed for the chapters the flows declare and filtered so that "
         "Part 2 never loosens Part 1 (no substitution in C2, scale-up only below TRL 7). L2 "
         "runs the cross-method rules and L3 surfaces the critical decision points. When two "
         "answers contradict each other the engine writes a note; it never blocks on it and "
         "never changes an answer.")

# ===================================================================== SLIDE 5
s = prs.slides.add_slide(BLANK)
banner(s, "The configuration on screen")
lead(s, "Each row says what the answers decided, and why.")
picture(s, "03-result.png", Inches(0.5), Inches(1.8), Inches(6.0), Inches(4.8), top=0.055)
tf = textbox(s, Inches(6.8), Inches(1.85), Inches(6.0), Inches(3.4))
bullets(tf, [
    "Costing: C+E, C+E+S, C+N, C+N+S, or C-LCC only",
    "Study horizon: present-day or future background (SSP/RCP)",
    "Reference scenario: HNSRS, modern counterfactual, or CNSRS, plus market",
    "Functional unit: function-oriented, input-based, output-based, or system",
    "Local impacts: site-specific, regional, or per emission territory",
    "Public claim: panel review, no weighting (Q4 = C)",
    "Sector rules: Part 2 chapters, with the flows that open them",
    "Shared assets: CAPEX and OPEX shared among partners",
], size=12.5, color=TEXTBLUE, space_after=5)
green_box(s, Inches(6.8), Inches(5.45), Inches(6.0), Inches(1.1))
tf = textbox(s, Inches(7.05), Inches(5.55), Inches(5.5), Inches(0.9), MSO_ANCHOR.MIDDLE)
para(tf, "Open a row: the engine's text, in English, with its deliverable section.",
     13, DARKBLUE, bold=True, first=True)
footer(s)
notes(s, "The result page leads with the ILCD situation and the rows of 'Your "
         "configuration'. Costing: with an LCA, a C-LCC per partner and an E-LCC of the "
         "network, plus the societal LCC when Q10 says yes; without an LCA there is no "
         "E-LCC (D4.2 §4.1), so the network level is a consolidation of the company LCCs; "
         "for strict reporting of one company only the C-LCC, a declared T4.6 design choice. "
         "Each row carries its reason, and opening it shows the node text in English with "
         "the section of the deliverable it comes from, so a reviewer can check every value "
         "against D4.1 or D4.2.")

# ===================================================================== SLIDE 6
s = prs.slides.add_slide(BLANK)
banner(s, "What to do next: obligations, decision points, data")
lead(s, "The configuration becomes a work plan and a data request.")
tf = textbox(s, Inches(0.5), Inches(1.85), Inches(6.6), Inches(4.7))
bullets(tf, [
    "Decision points: cross-method tensions the analyst resolves and justifies",
    "Obligations by family (IR, CIR, FU, B), listed in the DCF",
    "Obligations are documented, not reported as errors",
    "No rule overwrites a node; three retired rules keep their reasons",
    "Data Collection File, xlsx and docx, calibrated on the configuration",
    "Network builder: actors and flows, round-trip to the files",
    "Case report (.docx); four audience views; public share links",
    "Five languages: EN · IT · FR · DE · ES",
], size=14, color=TEXTBLUE, space_after=9)
picture(s, "04-cases.png", Inches(7.4), Inches(1.85), Inches(5.45), Inches(4.7))
footer(s)
notes(s, "'What to do next' lists the critical decision points to resolve and counts the "
         "obligations by family: integration of the methods, rules switched on by the "
         "answers, functional unit, boundaries; the full list, with what triggered each one, "
         "is in the Data Collection File. They are obligations to document, not violations: "
         "the tool cannot see what the analyst does outside it, so it says what must be "
         "documented instead of pretending to check it. Three rules that read attributes the "
         "case never had were retired, each with its reason in the schema. The Data "
         "Collection File, in Excel and Word, asks only for the data this configuration "
         "needs, and the network builder draws the actors and flows. The case report and the "
         "four audience views, for industry, local community, authority and end user, reuse "
         "the same configuration.")

# ===================================================================== SLIDE 7
s = prs.slides.add_slide(BLANK)
banner(s, "Validation and status")
lead(s, "Tested on 8 real cases from the literature corpus.")
columns = [
    ("Validation", Inches(0.5), [
        "69 study-level choice points: 63 agree, 6 differ",
        "All 6 differences are documented, decided divergences",
        "Part 2 chapter per flow: 37 of 53",
        "826 backend + 187 frontend automated tests",
    ]),
    ("Status", Inches(4.75), [
        "Online at biobasedisadvisor.symbaproject.eu, team preview",
        "Computes no LCA/LCC/S-LCA numbers; scoring from partners",
        "Open: CIRCE scoring I/O specification",
        "Open: public opening; D4.1/D4.2 revision in progress",
    ]),
]
for title, cx, items in columns:
    box = blue_box(s, cx, Inches(1.85), Inches(4.05), Inches(3.5))
    box.fill.fore_color.rgb = WHITE
    tf = textbox(s, cx + Inches(0.25), Inches(2.0), Inches(3.6), Inches(3.25))
    para(tf, title, 17, BLUE, bold=True, first=True, space_after=10)
    for text in items:
        para(tf, text, 12.5, DARKBLUE, bullet=True, space_after=8)
picture(s, "05-about.png", Inches(9.05), Inches(1.85), Inches(3.8), Inches(3.5))
bb = blue_box(s, Inches(0.5), Inches(5.6), Inches(12.33), Inches(0.95))
tf = bb.text_frame; tf.word_wrap = True
para(tf, "WP4 · Task 4.6 (ENCO) · SYMBA · Grant Agreement 101135562", 14, DARKBLUE,
     bold=True, first=True, align=PP_ALIGN.CENTER)
footer(s)
notes(s, "We ran the tool on eight real cases from the literature corpus. On sixty-nine "
         "study-level choice points, sixty-three agree with what the authors did and six "
         "differ. All six are divergences we decided and documented: the single study "
         "horizon in three cases, the rule on public comparative claims, one paper with an "
         "ambiguous functional unit, and one artefact of the verification script. For the "
         "Part 2 chapter of each flow the match is 37 of 53. The code carries 826 backend "
         "and 187 frontend tests. The tool is online at biobasedisadvisor.symbaproject.eu, "
         "still in team preview. It computes no numbers: scoring comes from the partners, "
         "and the CIRCE input-output specification is the main open point, together with "
         "the public opening and the alignment with the revised D4.1 and D4.2. Thank you.")

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "SYMBA_T46_GA_corrected.pptx")
prs.save(OUT)
print("saved", OUT)
