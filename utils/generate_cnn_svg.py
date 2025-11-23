def generate_cnn_svg():
    svg_lines = []
    width = 400  # Increased width to fit Output
    height = 300
    svg_lines.append(f'<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg" class="architecture-diagram">')
    
    # Definitions for gradients and markers
    svg_lines.append('''
    <defs>
        <linearGradient id="grad-input" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.8" />
        </linearGradient>
        <linearGradient id="grad-conv1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4ecdc4;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#556270;stop-opacity:0.8" />
        </linearGradient>
        <linearGradient id="grad-conv2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#556270;stop-opacity:0.8" />
        </linearGradient>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="white" />
        </marker>
    </defs>
    ''')

    # Helper to draw a 3D block
    def draw_block(x, y, w, h, d, color_id, label):
        # Front face
        svg_lines.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="url(#{color_id})" stroke="white" stroke-width="1" />')
        # Top face
        svg_lines.append(f'<path d="M{x},{y} L{x+d},{y-d} L{x+w+d},{y-d} L{x+w},{y} Z" fill="url(#{color_id})" opacity="0.6" stroke="white" stroke-width="0.5" />')
        # Side face
        svg_lines.append(f'<path d="M{x+w},{y} L{x+w+d},{y-d} L{x+w+d},{y+h-d} L{x+w},{y+h} Z" fill="url(#{color_id})" opacity="0.4" stroke="white" stroke-width="0.5" />')
        # Label
        svg_lines.append(f'<text x="{x + w/2}" y="{y + h + 20}" text-anchor="middle" font-size="12" fill="white" font-weight="bold">{label}</text>')

    # 1. Input Image (64x64x3)
    draw_block(20, 100, 50, 50, 10, "grad-input", "Input Image")
    # Add grid pattern to Input to look like pixels
    for i in range(1, 5):
        svg_lines.append(f'<line x1="{20 + i*10}" y1="100" x2="{20 + i*10}" y2="150" stroke="rgba(255,255,255,0.3)" stroke-width="1" />')
        svg_lines.append(f'<line x1="20" y1="{100 + i*10}" x2="70" y2="{100 + i*10}" stroke="rgba(255,255,255,0.3)" stroke-width="1" />')

    # Arrow
    svg_lines.append('<line x1="80" y1="125" x2="100" y2="125" stroke="white" stroke-width="2" marker-end="url(#arrow)" />')

    # 2. Conv Layer 1 (Feature Maps)
    draw_block(110, 110, 40, 40, 15, "grad-conv1", "Conv1")

    # Arrow
    svg_lines.append('<line x1="165" y1="130" x2="185" y2="130" stroke="white" stroke-width="2" marker-end="url(#arrow)" />')

    # 3. Conv Layer 2 (More depth, smaller spatial)
    draw_block(195, 120, 20, 20, 25, "grad-conv2", "Conv2")

    # Arrow
    svg_lines.append('<line x1="240" y1="130" x2="260" y2="130" stroke="white" stroke-width="2" marker-end="url(#arrow)" />')

    # 4. Fully Connected (Nodes)
    cx = 280
    cy_start = 100
    for i in range(5):
        svg_lines.append(f'<circle cx="{cx}" cy="{cy_start + i*15}" r="4" fill="#feca57" stroke="white" stroke-width="1" />')
        # Connections from Conv2 to FC (simplified)
        svg_lines.append(f'<line x1="240" y1="130" x2="{cx}" y2="{cy_start + i*15}" stroke="rgba(255,255,255,0.2)" stroke-width="0.5" />')
    
    svg_lines.append(f'<text x="{cx}" y="{cy_start + 5*15 + 15}" text-anchor="middle" font-size="12" fill="white" font-weight="bold">FC</text>')

    # Arrow
    svg_lines.append(f'<line x1="{cx + 10}" y1="130" x2="{cx + 30}" y2="130" stroke="white" stroke-width="2" marker-end="url(#arrow)" />')

    # 5. Output (Probabilities)
    ox = cx + 40
    oy_start = 100
    svg_lines.append(f'<text x="{ox + 20}" y="{oy_start - 10}" text-anchor="middle" font-size="12" fill="white" font-weight="bold">Output</text>')
    
    probs = [0.1, 0.8, 0.05, 0.02, 0.03]
    for i, p in enumerate(probs):
        # Bar background
        svg_lines.append(f'<rect x="{ox}" y="{oy_start + i*15 - 4}" width="40" height="8" fill="rgba(255,255,255,0.1)" rx="2" />')
        # Bar value
        color = "#4ecdc4" if p > 0.5 else "#ff6b6b"
        svg_lines.append(f'<rect x="{ox}" y="{oy_start + i*15 - 4}" width="{40 * p}" height="8" fill="{color}" rx="2" />')

    svg_lines.append('</svg>')
    return '\n'.join(svg_lines)

if __name__ == "__main__":
    print(generate_cnn_svg())
