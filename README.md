# HoloCard - React Component for Holographic Card Effects

A React component that creates stunning holographic card effects with multiple visual styles and interactive animations.

## ✨ Features

- ✨ Multiple holographic effect styles
- 🎮 Interactive hover/tilt effects
- 📱 Mobile-responsive
- 🎨 Customizable appearance

- ⚡ Powered by React Spring for smooth animations

## 📦 Installation

```bash
npm install holo-card
# or
yarn add holo-card
```

## 📎 Peer Dependencies

Make sure you have these installed in your project:

```bash
npm install react react-dom @react-spring/web
```

## 🚀 Usage

Basic Usage

```bash
import { HoloCard } from 'holo-card';
import 'holo-card/dist/styles/Card.css'; // Base styles required

function App() {
  return (
    <HoloCard
      img="path/to/your/image.jpg"
      data_set="Shiny"
    />
  );
}
```

## 🛠️ All Props

| Prop           | Type               | Default    | Description                                                                                                    |
| -------------- | ------------------ | ---------- | -------------------------------------------------------------------------------------------------------------- |
| `img`          | `string`           | required   | Image URL for the card                                                                                         |
| `radius`       | `number \| string` | -          | Border radius (px or valid CSS value)                                                                          |
| `foil`         | `string`           | -          | URL for foil texture image                                                                                     |
| `mask`         | `string`           | -          | URL for mask image                                                                                             |
| `enableEffect` | `boolean`          | `true`     | Enable interactive effects                                                                                     |
| `data_set`     | `string`           | `"Normal"` | Visual style: `"Shiny"`, `"Shiny_raycast"`, `"Normal"`, `"Vibrant"`, `"Radiant"`, `"Glittery"`, or `"Disable"` |

## 🎨 Available Styles

Import the base style and any additional style you want to use:

```bash
import 'holo-card/dist/styles/Card.css'; // Required
import 'holo-card/dist/styles/Card_Shiny.css';
import 'holo-card/dist/styles/Card_Radiant.css';
// etc.
```

## 💡 Advanced Usage with Custom Effects

```bash
import { HoloCard, useHolographicEffect } from 'holo-card';

function CustomCard() {
  const { springStyle, handleInteract } = useHolographicEffect();

  return (
    <div
      style={springStyle}
      onMouseMove={handleInteract}
    >
      {/* Your custom card implementation */}
    </div>
  );
}
```

## 🧪 Examples

```bash
//Default
<HoloCard img="pokemon.jpg" data_set="Shiny" />

//Custom Radius
<HoloCard img="pokemon.jpg" radius={20} />
<HoloCard img="pokemon.jpg" radius={"5% / 10%"} />

//With Foil and mask
<HoloCard
  img="pokemon.jpg"
  foil="foil-texture.png"
  mask="custom-mask.png"
/>
```

## 🎥 Demo

![uZR1Lg4](https://github.com/user-attachments/assets/4d4a03e0-1758-4c6d-8b16-fd9ca07c0241)

*Demo showing the HoloCard in action*

## 🪝 Hook API

Use useHolographicEffect for custom implementations:

```bash
const {
  isMobile,          // boolean - if user is on mobile
  isActive,          // boolean - if card is active
  isInteracting,     // boolean - if user is interacting
  isLoading,         // boolean - if image is loading
  setIsActive,       // function - set active state
  setIsLoading,      // function - set loading state
  handleInteract,    // function - mouse move handler
  handleInteractEnd, // function - mouse leave handler
  retreat,           // function - reset animations
  springStyle        // object - react-spring styles
} = useHolographicEffect(showcase?: boolean);
// etc.
```

## 📚 Inspiration & Credits

This project was heavily inspired by the amazing work in  
[@simeydotme/pokemon-cards-css](https://github.com/simeydotme/pokemon-cards-css).

> 🎨 **Note:** Almost all of the base CSS styles for the holographic effects are derived from that repository.

A huge thanks to [@simeydotme](https://github.com/simeydotme) for the brilliant visual design!


