"""
==== Designed by Brad Hayes with Google AI Studio ====
==== prompt_builder_module.py
==== Version 1.0 : 3/15/2026
"""

try:
    import FreeSimpleGUI as sg
except ImportError:
    import PySimpleGUI as sg
import styles
import os
import json

PROMPT_FILE = "prompt_builder_save.txt"
HISTORY_FILE = "prompt_history.json"

def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_history(history):
    try:
        with open(HISTORY_FILE, "w") as f:
            json.dump(history, f)
    except:
        pass

def get_layout(colors, is_sidebar=True, key_prefix=''):
    templates = [
        "--- Basic ---",
        "Summarize this text:",
        "Explain this like I'm 5:",
        "Translate the following to Spanish:",
        "Extract key points from:",
        "--- Coding ---",
        "Refactor this code for better performance:",
        "Find potential bugs in this snippet:",
        "Write a Python unit test for:",
        "Add detailed comments to this code:",
        "Convert this logic to a different language:",
        "--- System ---",
        "You are a helpful assistant.",
        "You are a professional software engineer.",
        "You are a creative technical writer.",
        "You are a security auditor."
    ]

    saved_prompt = ""
    if os.path.exists(PROMPT_FILE):
        try:
            with open(PROMPT_FILE, "r") as f:
                saved_prompt = f.read()
        except:
            pass

    history = load_history()
    history_names = sorted(list(history.keys()))

    size_multiline = (30, 12) if is_sidebar else (80, 15)
    size_listbox = (30, 10) if is_sidebar else (40, 10)
    bg_color = styles.COLORS['bg_light'] if is_sidebar else styles.COLORS['dashboard_bg']

    layout = [
        [sg.Text('AI Prompt Assist' if not is_sidebar else 'Prompt Builder', 
                 font=styles.FONTS['header'] if not is_sidebar else styles.FONTS['ui_bold'], 
                 background_color=bg_color)],
        [sg.Text('History:', background_color=bg_color)],
        [sg.Combo(history_names, key=f'{key_prefix}-HISTORY-COMBO-', size=(20 if is_sidebar else 40, 1), enable_events=True), 
         sg.Button('Load', key=f'{key_prefix}-LOAD-HISTORY-', size=(5, 1)),
         sg.Button('X', key=f'{key_prefix}-DELETE-HISTORY-', size=(2, 1), button_color=('white', styles.COLORS['error']))],
        [sg.Text('Templates:', background_color=bg_color)],
        [sg.Listbox(values=templates, size=size_listbox, key=f'{key_prefix}-TEMPLATE-LIST-', enable_events=True)],
        [sg.Text('Builder:', background_color=bg_color)],
        [sg.Multiline(default_text=saved_prompt, size=size_multiline, key=f'{key_prefix}-PROMPT-BUILDER-', enable_events=True, expand_x=True, expand_y=True, font=styles.FONTS['mono'])],
        [sg.Button('Save Draft', key=f'{key_prefix}-SAVE-PROMPT-', size=(12, 1)), 
         sg.Button('Add to History', key=f'{key_prefix}-ADD-HISTORY-', size=(15, 1))],
        [sg.Button('Send to AI Assistant', key=f'{key_prefix}-USE-PROMPT-', size=(30 if is_sidebar else 40, 1), **styles.get_button_style('accent'))]
    ]
    
    return layout

def handle_events(event, values, window, key_prefix=''):
    if event == f'{key_prefix}-PROMPT-BUILDER-':
        try:
            with open(PROMPT_FILE, "w") as f:
                f.write(values[f'{key_prefix}-PROMPT-BUILDER-'])
        except:
            pass

    if event == f'{key_prefix}-TEMPLATE-LIST-':
        selected = values[f'{key_prefix}-TEMPLATE-LIST-'][0]
        if not selected.startswith("---"):
            current = values[f'{key_prefix}-PROMPT-BUILDER-']
            new_text = current + ("\n" if current and not current.endswith("\n") else "") + selected + " "
            window[f'{key_prefix}-PROMPT-BUILDER-'].update(new_text)
            window.write_event_value(f'{key_prefix}-PROMPT-BUILDER-', new_text)

    if event == f'{key_prefix}-SAVE-PROMPT-':
        try:
            with open(PROMPT_FILE, "w") as f:
                f.write(values[f'{key_prefix}-PROMPT-BUILDER-'])
            sg.popup_quick_message("Draft Saved!", background_color='#40E0D0', text_color='white')
        except:
            pass

    if event == f'{key_prefix}-ADD-HISTORY-':
        prompt_text = values[f'{key_prefix}-PROMPT-BUILDER-']
        if prompt_text:
            name = sg.popup_get_text("Enter a name for this prompt:", title="Save to History")
            if name:
                history = load_history()
                history[name] = prompt_text
                save_history(history)
                # Update all instances if possible, but for now just this one
                window[f'{key_prefix}-HISTORY-COMBO-'].update(values=sorted(list(history.keys())), value=name)

    if event == f'{key_prefix}-LOAD-HISTORY-':
        name = values[f'{key_prefix}-HISTORY-COMBO-']
        if name:
            history = load_history()
            if name in history:
                window[f'{key_prefix}-PROMPT-BUILDER-'].update(history[name])
                window.write_event_value(f'{key_prefix}-PROMPT-BUILDER-', history[name])

    if event == f'{key_prefix}-DELETE-HISTORY-':
        name = values[f'{key_prefix}-HISTORY-COMBO-']
        if name:
            if sg.popup_yes_no(f"Delete '{name}'?") == 'Yes':
                history = load_history()
                if name in history:
                    del history[name]
                    save_history(history)
                    window[f'{key_prefix}-HISTORY-COMBO-'].update(values=sorted(list(history.keys())), value='')

    if event == f'{key_prefix}-USE-PROMPT-':
        builder_text = values[f'{key_prefix}-PROMPT-BUILDER-']
        if builder_text:
            return True
    return False
