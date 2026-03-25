"""
==== Designed by Brad Hayes with Google AI Studio ====
==== project_module.py
==== Version 1.0 : 3/15/2026
"""

try:
    import FreeSimpleGUI as sg
except ImportError:
    import PySimpleGUI as sg

import styles
import json
import os

PROJECT_FILE = "projects.json"

def load_projects():
    if os.path.exists(PROJECT_FILE):
        try:
            with open(PROJECT_FILE, "r") as f:
                return json.load(f)
        except:
            return []
    return [
        {'name': 'Aura Desktop', 'status': 'In Progress', 'progress': 60},
        {'name': 'Local LLM Integration', 'status': 'Planning', 'progress': 20},
        {'name': 'Data Viz Tool', 'status': 'Completed', 'progress': 100}
    ]

def save_projects(projects):
    try:
        with open(PROJECT_FILE, "w") as f:
            json.dump(projects, f)
    except:
        pass

def get_layout(colors):
    projects = load_projects()
    
    project_rows = []
    for p in projects:
        row = [
            sg.Frame(p['name'], [
                [sg.Text(f"Status: {p['status']}", background_color=styles.COLORS['bg_light'], font=styles.FONTS['body'])],
                [sg.ProgressBar(100, orientation='h', size=(20, 20), key=f"-PROG-{p['name']}-", bar_color=(styles.COLORS['primary'], 'white'))]
            ], background_color=styles.COLORS['bg_light'], expand_x=True, font=styles.FONTS['body_bold'])
        ]
        project_rows.append(row)
        
    layout = [
        [sg.Text('Project Hub', font=styles.FONTS['header'], text_color=styles.COLORS['text'], background_color=styles.COLORS['dashboard_bg'])],
        [sg.Column(project_rows, background_color=styles.COLORS['dashboard_bg'], scrollable=True, vertical_scroll_only=True, expand_x=True, expand_y=True)]
    ]
    
    return layout

def handle_events(event, values, window):
    # Handle project specific interactions here
    pass
