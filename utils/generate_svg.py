import random

def generate_svg():
    # Configuration
    width = 400
    height = 300
    
    # Layers configuration: x-position, y-range-start, y-range-end, count
    layers = [
        {'x': 100, 'y_start': 60, 'y_end': 200, 'count': 6},  # Input (avoiding bottom-left Card 3)
        {'x': 180, 'y_start': 40, 'y_end': 260, 'count': 8},  # Hidden 1
        {'x': 260, 'y_start': 40, 'y_end': 260, 'count': 8},  # Hidden 2
        {'x': 340, 'y_start': 60, 'y_end': 240, 'count': 6}   # Output (avoiding right-middle Card 2? Card 2 is x~320, y~150. This might overlap.)
    ]
    
    # Adjust Layer 4 to avoid Card 2 (x~320, y~150)
    # Let's split Layer 4 or move it. 
    # Card 2 is right: 20% -> x=320. y=50% -> y=150.
    # So x=340 is to the right of Card 2. It might be behind it or just to the right.
    # Let's move Layer 4 to x=360 to be safe, or split the y-range to avoid 130-170.
    layers[3]['x'] = 360
    
    nodes = []
    
    # Generate Nodes
    for layer_idx, layer in enumerate(layers):
        step = (layer['y_end'] - layer['y_start']) / (layer['count'] - 1)
        for i in range(layer['count']):
            y = layer['y_start'] + i * step
            
            # Specific avoidance for Card 2 (Right Middle)
            if layer_idx == 3 and 120 < y < 180:
                continue # Skip nodes directly behind Card 2
                
            nodes.append({
                'id': f'l{layer_idx}_n{i}',
                'layer': layer_idx,
                'x': layer['x'],
                'y': y,
                'color': random.choice(['#ff6b6b', '#4ecdc4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'])
            })

    # Generate Connections
    connections = []
    for i, node_a in enumerate(nodes):
        for j, node_b in enumerate(nodes):
            if node_b['layer'] == node_a['layer'] + 1:
                # Connect adjacent layers
                # Distance check to avoid too long vertical lines
                if abs(node_a['y'] - node_b['y']) < 100:
                    # Randomly drop some connections to avoid clutter, but keep it "rich"
                    if random.random() > 0.3: 
                        connections.append({
                            'x1': node_a['x'],
                            'y1': node_a['y'],
                            'x2': node_b['x'],
                            'y2': node_b['y'],
                            'opacity': random.uniform(0.1, 0.4)
                        })

    # Generate SVG String
    svg_lines = []
    svg_lines.append('<svg class="neural-network" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">')
    
    # Add Connections first (background)
    svg_lines.append('    <!-- Neural Network Connections -->')
    for conn in connections:
        svg_lines.append(f'    <line x1="{conn["x1"]}" y1="{conn["y1"]}" x2="{conn["x2"]}" y2="{conn["y2"]}" '
                         f'stroke="rgba(255,255,255,{conn["opacity"]:.2f})" stroke-width="1" class="neural-connection" />')
    
    # Add Nodes
    svg_lines.append('    <!-- Neural Network Nodes -->')
    for node in nodes:
        delay = random.uniform(0, 2)
        svg_lines.append(f'    <circle cx="{node["x"]}" cy="{node["y"]}" r="{random.randint(4, 7)}" '
                         f'fill="{node["color"]}" class="neural-node" data-delay="{delay:.1f}s" />')
                         
    svg_lines.append('</svg>')
    
    return '\n'.join(svg_lines)

if __name__ == "__main__":
    print(generate_svg())
