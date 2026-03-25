"""
==== Designed by Brad Hayes with Google AI Studio ====
==== ai_module.py
==== Version 1.0 : 3/15/2026
"""

try:
    import FreeSimpleGUI as sg
except ImportError:
    import PySimpleGUI as sg
import styles
import threading
import os
import prompt_builder_module

# Note: For local AI, we suggest using 'ollama' or 'transformers'
try:
    import ollama
    HAS_OLLAMA = True
except ImportError:
    HAS_OLLAMA = False

def check_ollama():
    if not HAS_OLLAMA:
        return False
    try:
        # Just a quick check to see if the service is up
        import ollama
        ollama.list()
        return True
    except:
        return False

def get_layout(colors):
    if not check_ollama():
        sg.popup_error("Ollama is not running! AI Assistant will not work.\nPlease start Ollama and restart the app.", 
                       background_color=styles.COLORS['error'], text_color=styles.COLORS['white'], font=styles.FONTS['ui_bold'])
    
    left_column = [
        [sg.Text('AI Assistant', font=styles.FONTS['header'], text_color=styles.COLORS['text'], background_color=styles.COLORS['dashboard_bg']),
         sg.Push(background_color=styles.COLORS['dashboard_bg']),
         sg.Button('Toggle Prompt Builder', key='-TOGGLE-BUILDER-', **styles.get_button_style('secondary'))],
        [sg.Text('Model:', background_color=styles.COLORS['dashboard_bg']), 
         sg.Combo(['llama3', 'mistral', 'codellama', 'phi3'], default_value='llama3', key='-AI-MODEL-', size=(15, 1))],
        [sg.Text('System Prompt:', background_color=styles.COLORS['dashboard_bg'])],
        [sg.Input(default_text="You are a helpful assistant.", key='-SYSTEM-PROMPT-', expand_x=True)],
        [sg.Multiline(size=(60, 15), key='-CHAT-HISTORY-', disabled=True, background_color='white', text_color='black', expand_x=True, expand_y=True, font=styles.FONTS['mono'])],
        [sg.Input(key='-CHAT-INPUT-', size=styles.SIZES['input_large'], expand_x=True), 
         sg.Button('Send', key='-SEND-CHAT-', **styles.get_button_style('primary'), bind_return_key=True)]
    ]

    right_sidebar = prompt_builder_module.get_layout(colors, is_sidebar=True, key_prefix='-AI-')

    layout = [
        [sg.Column(left_column, background_color=colors['dashboard_bg'], expand_x=True, expand_y=True, pad=(10, 10)),
         sg.Column(right_sidebar, key='-AI-SIDEBAR-', background_color=colors['bg_light'], expand_y=True, pad=(10, 10), visible=True)]
    ]
    return layout

def handle_events(event, values, window):
    # Handle Toggle
    if event == '-TOGGLE-BUILDER-':
        is_visible = window['-AI-SIDEBAR-'].visible
        window['-AI-SIDEBAR-'].update(visible=not is_visible)

    # Delegate to prompt builder module
    if prompt_builder_module.handle_events(event, values, window, key_prefix='-AI-'):
        # If True, it means 'Send to AI Assistant' was clicked
        builder_text = values['-AI-PROMPT-BUILDER-']
        window['-CHAT-INPUT-'].update(builder_text)
        window.write_event_value('-SEND-CHAT-', None)

    if event == '-SEND-CHAT-':
        user_msg = values['-CHAT-INPUT-']
        model = values['-AI-MODEL-']
        system_prompt = values['-SYSTEM-PROMPT-']
        
        if not user_msg:
            return
            
        window['-CHAT-HISTORY-'].update(f"You: {user_msg}\n", append=True)
        window['-CHAT-INPUT-'].update('')
        
        threading.Thread(target=get_ai_response, args=(user_msg, model, system_prompt, window), daemon=True).start()

    if event == '-AI-RESPONSE-':
        history = window['-CHAT-HISTORY-'].get()
        new_history = history.replace("AI: Thinking...\n", "")
        window['-CHAT-HISTORY-'].update(new_history)
        window['-CHAT-HISTORY-'].update(f"AI: {values['-AI-RESPONSE-']}\n\n", append=True)

def get_ai_response(prompt, model, system_prompt, window):
    window['-CHAT-HISTORY-'].update("AI: Thinking...\n", append=True)
    
    response_text = ""
    if HAS_OLLAMA:
        try:
            response = ollama.chat(model=model, messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': prompt},
            ])
            response_text = response['message']['content']
        except Exception as e:
            response_text = f"Error: {str(e)}"
    else:
        response_text = "Ollama not detected."

    window.write_event_value('-AI-RESPONSE-', response_text)
