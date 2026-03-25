"""
==== QE AI Dashboard - Centralized Style Sheet ====
==== styles.py
==== Version 1.1 : 3/25/2026
"""

# 1. Global Theme Selection
# Options: 'LightGrey1', 'DarkGrey8', 'DarkBlue3', 'Topanga', etc.
THEME_NAME = 'LightGrey1'

# 2. Color Palette (Hex Codes)
COLORS = {
    'primary': '#40E0D0',      # Turquoise (Buttons/Highlights)
    'accent': '#FFA500',       # Orange (Logo/Accents)
    'bg_light': '#FFD580',     # Light Orange (Sidebar/Frames)
    'secondary': '#ADD8E6',    # Light Blue (Nav Buttons)
    'dashboard_bg': '#FFF9F0', # Main Content Background
    'text': '#27272a',         # Zinc-800 (Primary Text)
    'error': '#ef4444',        # Red (Warnings/Errors)
    'white': '#FFFFFF'
}

# 3. Typography (Fonts)
FONTS = {
    'title': ('Space Grotesk', 24, 'bold'),
    'header': ('Space Grotesk', 20, 'bold'),
    'body': ('Inter', 10),
    'body_bold': ('Inter', 10, 'bold'),
    'ui_element': ('Inter', 12),
    'ui_bold': ('Inter', 12, 'bold'),
    'mono': ('JetBrains Mono', 10)
}

# 4. Element Sizing & Spacing
SIZES = {
    'window': (1200, 800),
    'sidebar_button': (18, 1),
    'input_large': (50, 1),
    'table_col_widths': [20, 10],
    'padding_main': (20, 20),
    'padding_element': (10, 10)
}

# 5. Common Element Styles (Reusable parameter sets)
def get_button_style(color_key='primary'):
    return {
        'button_color': (COLORS['white'], COLORS[color_key]),
        'border_width': 0,
        'font': FONTS['body_bold']
    }

def get_text_style(font_key='body'):
    return {
        'text_color': COLORS['text'],
        'background_color': COLORS['dashboard_bg'],
        'font': FONTS[font_key]
    }
