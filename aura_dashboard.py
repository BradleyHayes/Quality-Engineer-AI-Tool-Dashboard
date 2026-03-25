"""
==== Designed by Brad Hayes with Google AI Studio ====
==== aura_dashboard.py
==== Version 1.0 : 3/15/2026
"""

try:
    import FreeSimpleGUI as sg
except ImportError:
    import PySimpleGUI as sg
import styles
import ai_module
import task_module
import project_module
import prompt_builder_module

def create_main_layout():
    # Sidebar navigation
    sidebar = [
        [sg.Text('AURA AI', font=styles.FONTS['header'], text_color=styles.COLORS['accent'], background_color=styles.COLORS['bg_light'], pad=(10, 20))],
        [sg.Button('Dashboard', key='-DASHBOARD-', size=styles.SIZES['sidebar_button'], button_color=(styles.COLORS['text'], styles.COLORS['secondary']), border_width=0)],
        [sg.Button('AI Assistant', key='-AI-', size=styles.SIZES['sidebar_button'], button_color=(styles.COLORS['text'], styles.COLORS['secondary']), border_width=0)],
        [sg.Button('AI Prompt Assist', key='-PROMPT-NAV-', size=styles.SIZES['sidebar_button'], button_color=(styles.COLORS['text'], styles.COLORS['secondary']), border_width=0)],
        [sg.Button('Task Organizer', key='-TASKS-', size=styles.SIZES['sidebar_button'], button_color=(styles.COLORS['text'], styles.COLORS['secondary']), border_width=0)],
        [sg.Button('Project Hub', key='-PROJECTS-', size=styles.SIZES['sidebar_button'], button_color=(styles.COLORS['text'], styles.COLORS['secondary']), border_width=0)],
        [sg.VPush(background_color=styles.COLORS['bg_light'])],
        [sg.Button('Exit', size=styles.SIZES['sidebar_button'], button_color=('white', styles.COLORS['error']), border_width=0)]
    ]

    # Main content area
    content = [
        [sg.Column(create_dashboard_layout(), key='-COL-DASHBOARD-', background_color=styles.COLORS['dashboard_bg'], visible=True, expand_x=True, expand_y=True),
         sg.Column(ai_module.get_layout(styles.COLORS), key='-COL-AI-', background_color=styles.COLORS['dashboard_bg'], visible=False, expand_x=True, expand_y=True),
         sg.Column(prompt_builder_module.get_layout(styles.COLORS, is_sidebar=False, key_prefix='-DASH-'), key='-COL-PROMPT-', background_color=styles.COLORS['dashboard_bg'], visible=False, expand_x=True, expand_y=True),
         sg.Column(task_module.get_layout(styles.COLORS), key='-COL-TASKS-', background_color=styles.COLORS['dashboard_bg'], visible=False, expand_x=True, expand_y=True),
         sg.Column(project_module.get_layout(styles.COLORS), key='-COL-PROJECTS-', background_color=styles.COLORS['dashboard_bg'], visible=False, expand_x=True, expand_y=True)]
    ]

    layout = [
        [sg.Column(sidebar, background_color=styles.COLORS['bg_light'], expand_y=True, pad=(0, 0)),
         sg.Column(content, background_color=styles.COLORS['dashboard_bg'], expand_x=True, expand_y=True, pad=(0, 0))]
    ]
    
    return layout

def create_dashboard_layout():
    return [
        [sg.Text('Welcome to Aura AI', font=styles.FONTS['title'], text_color=styles.COLORS['text'], background_color=styles.COLORS['dashboard_bg'], pad=(20, 20))],
        [sg.Text('Select a module from the sidebar to get started.', font=styles.FONTS['ui_element'], text_color=styles.COLORS['text'], background_color=styles.COLORS['dashboard_bg'], pad=(20, 0))],
        [sg.Frame('', [
            [sg.Text('Quick Stats', font=styles.FONTS['ui_bold'], background_color=styles.COLORS['bg_light'])],
            [sg.Text('Active Projects: 4', background_color=styles.COLORS['bg_light'])],
            [sg.Text('Tasks Pending: 12', background_color=styles.COLORS['bg_light'])]
        ], background_color=styles.COLORS['bg_light'], border_width=0, pad=(20, 40), expand_x=True)]
    ]

def main():
    sg.theme(styles.THEME_NAME)
    sg.set_options(font=styles.FONTS['body'])
    
    window = sg.Window('Aura AI Desktop Dashboard', create_main_layout(), 
                       size=styles.SIZES['window'], 
                       background_color=styles.COLORS['dashboard_bg'],
                       no_titlebar=False,
                       resizable=True,
                       finalize=True)

    current_col = '-COL-DASHBOARD-'

    while True:
        event, values = window.read()
        
        if event in (sg.WIN_CLOSED, 'Exit'):
            break
            
        if event in ('-DASHBOARD-', '-AI-', '-TASKS-', '-PROJECTS-', '-PROMPT-NAV-'):
            window[current_col].update(visible=False)
            
            target = event.strip('-')
            if target == 'PROMPT-NAV':
                target = 'PROMPT'
                
            new_col = f"-COL-{target}-"
            window[new_col].update(visible=True)
            current_col = new_col
            
        # Handle module specific events
        ai_module.handle_events(event, values, window)
        prompt_builder_module.handle_events(event, values, window, key_prefix='-DASH-')
        
        # Sync prompt builders
        if event == '-AI-PROMPT-BUILDER-':
            window['-DASH-PROMPT-BUILDER-'].update(values['-AI-PROMPT-BUILDER-'])
        elif event == '-DASH-PROMPT-BUILDER-':
            window['-AI-PROMPT-BUILDER-'].update(values['-DASH-PROMPT-BUILDER-'])
            
        # Special case: Link 'Send to AI Assistant' from Prompt module to AI module
        if event == '-DASH-USE-PROMPT-' and current_col == '-COL-PROMPT-':
            builder_text = values['-DASH-PROMPT-BUILDER-']
            # Switch to AI tab
            window[current_col].update(visible=False)
            window['-COL-AI-'].update(visible=True)
            current_col = '-COL-AI-'
            # Update chat input and send
            window['-CHAT-INPUT-'].update(builder_text)
            window.write_event_value('-SEND-CHAT-', None)
        task_module.handle_events(event, values, window)
        project_module.handle_events(event, values, window)

    window.close()

if __name__ == '__main__':
    main()
