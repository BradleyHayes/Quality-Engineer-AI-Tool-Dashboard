"""
==== Designed by Brad Hayes with Google AI Studio ====
==== task_module.py
==== Version 1.0 : 3/15/2026
"""

try:
    import FreeSimpleGUI as sg
except ImportError:
    import PySimpleGUI as sg

import styles
import json
import os

TASK_FILE = "tasks.json"

def load_tasks():
    if os.path.exists(TASK_FILE):
        try:
            with open(TASK_FILE, "r") as f:
                return json.load(f)
        except:
            return []
    return [
        ['Design UI', 'High'],
        ['Implement Auth', 'Medium'],
        ['Write Docs', 'Low']
    ]

def save_tasks(tasks):
    try:
        with open(TASK_FILE, "w") as f:
            json.dump(tasks, f)
    except:
        pass

def get_layout(colors):
    tasks = load_tasks()
    
    layout = [
        [sg.Text('Task Organizer', font=styles.FONTS['header'], text_color=styles.COLORS['text'], background_color=styles.COLORS['dashboard_bg'])],
        [sg.Table(values=tasks, headings=['Task', 'Priority'], 
                  auto_size_columns=False,
                  col_widths=styles.SIZES['table_col_widths'],
                  display_row_numbers=False,
                  justification='left',
                  num_rows=10,
                  key='-TASK-TABLE-',
                  row_height=35,
                  header_background_color=styles.COLORS['secondary'],
                  background_color='white',
                  text_color='black',
                  expand_x=True)],
        [sg.Input(key='-NEW-TASK-', size=(40, 1)), 
         sg.Combo(['High', 'Medium', 'Low'], default_value='Medium', key='-PRIORITY-'),
         sg.Button('Add Task', key='-ADD-TASK-', **styles.get_button_style('primary'))]
    ]
    return layout

def handle_events(event, values, window):
    if event == '-ADD-TASK-':
        new_task = values['-NEW-TASK-']
        priority = values['-PRIORITY-']
        if new_task:
            current_tasks = window['-TASK-TABLE-'].get()
            current_tasks.append([new_task, priority])
            window['-TASK-TABLE-'].update(values=current_tasks)
            window['-NEW-TASK-'].update('')
            save_tasks(current_tasks)
