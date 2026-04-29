# HoloCard — React Holographic Card Component

A React component that creates stunning holographic card effects with multiple visual styles and interactive spring animations.

## ✨ Features

- 🃏 Multiple holographic effect styles (Shiny, Radiant, Glittery, and more)
- 🖱️ Interactive tilt & glare effects driven by Framer Motion
- 📱 Mobile-aware (pointer detection, not UA sniffing)
- 🎨 Composable — wrap any content with `HoloCardRoot`
- 🔌 Zero CSS imports required — styles are bundled automatically
- 🪝 Hook API for fully custom implementations

---

## 📦 Installation

```bash
npm install holo-card
# or
yarn add holo-card
```

## 📎 Peer Dependencies

```bash
npm install react react-dom framer-motion
```

---

## 🚀 Usage

### Simple — image card out of the box

```tsx
import { HoloCard } from 'holo-card';

function App() {
  return (
    <HoloCard
      img="path/to/your/image.jpg"
      dataSet="Shiny"
    />
  );
}
```

### Composable — wrap your own layout

Use `HoloCardRoot` when you want the holographic effect around your own card design.
No CSS imports needed — styles are injected automatically when the component loads.

```tsx
import { HoloCardRoot } from 'holo-card';

function GameCard({ game }) {
  return (
    <HoloCardRoot dataSet="Shiny">
      <GameCardPoster src={game.coverUrl} alt={game.title} />
      <GameCardHUD title={game.title} playtime={game.playTime} />
    </HoloCardRoot>
  );
}
```

### With foil and mask textures

```tsx
<HoloCardRoot
  dataSet="Shiny"
  foil="/textures/foil.png"
  mask="/textures/mask.png"
>
  <GameCardPoster src={game.coverUrl} alt={game.title} />
  <GameCardHUD title={game.title} />
</HoloCardRoot>
```

### With foil that activates on image load (render prop)

```tsx
<HoloCardRoot foil="/textures/foil.png" mask="/textures/mask.png" dataSet="Shiny">
  {({ onFoilLoad }) => (
    <img src="/card.jpg" onLoad={onFoilLoad} />
  )}
</HoloCardRoot>
```

---

## 🛠️ Props

### `HoloCard`

| Prop | Type | Default | Description |
|---|---|---|---|
| `img` | `string` | required | Image URL for the card face |
| `alt` | `string` | `"Holographic card"` | Alt text for the image |
| `dataSet` | `HoloStyle` | `"Normal"` | Visual effect style |
| `radius` | `number \| string` | — | Border radius — number is treated as px |
| `foil` | `string` | — | URL for foil overlay texture |
| `mask` | `string` | — | URL for mask image |
| `enableEffect` | `boolean` | `true` | Enable interactive tilt/glare |
| `onLoad` | `() => void` | — | Called when the card image finishes loading |

### `HoloCardRoot`

All `HoloCard` props except `img`, `alt`, and `onLoad`, plus:

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode \| (ctx) => ReactNode` | required | Card content. Accepts a render prop `({ onFoilLoad }) => ReactNode` for timing foil activation to an image load |
| `cardStyle` | `CSSProperties` | — | Extra styles on the inner `card_front` element — use for seed/cosmos shimmer variables |
| `className` | `string` | — | Extra class names merged with the card's own classes |
| `style` | `CSSProperties` | — | Extra styles merged after the spring styles |
| `onClick` | `MouseEventHandler` | — | Overrides the default toggle-active click handler |

### `HoloStyle` values

`"Shiny"` `"Shiny_raycast"` `"Normal"` `"Vibrant"` `"Radiant"` `"Glittery"` `"Disable"`

---

## 🪝 Hook API

Use `useHolographicEffect` for fully custom implementations:

```tsx
import { useHolographicEffect } from 'holo-card';
import { motion } from 'framer-motion';

function CustomCard() {
  const {
    isActive,          // boolean — card is toggled active
    isInteracting,     // boolean — user is hovering
    isMobile,          // boolean — coarse pointer detected
    handleInteract,    // MouseMoveHandler — drives the spring
    handleInteractEnd, // MouseLeaveHandler — snaps back to rest
    retreat,           // () => void — immediately resets all springs
    springStyle,       // Record<string, MotionValue> — spread onto a motion.*
  } = useHolographicEffect();

  return (
    <motion.div style={springStyle} onMouseMove={handleInteract} onMouseLeave={handleInteractEnd}>
      {/* your card */}
    </motion.div>
  );
}
```

---

## 🎥 Demo

![uZR1Lg4](https://github.com/user-attachments/assets/4d4a03e0-1758-4c6d-8b16-fd9ca07c0241)

---

## 📚 Inspiration & Credits

This project was heavily inspired by the amazing work in  
[@simeydotme/pokemon-cards-css](https://github.com/simeydotme/pokemon-cards-css).

> 🎨 **Note:** Almost all of the base CSS styles for the holographic effects are derived from that repository.

A huge thanks to [@simeydotme](https://github.com/simeydotme) for the brilliant visual design!