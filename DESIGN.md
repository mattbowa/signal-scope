# Signal Scope - Design Document

## The Layout (Low-Fi Wireframe)

```
┌─────────────────────────────────────────────────────────────────┐
│  Signal Scope                                                   │
│  Murray Irrigation - Sensor Data Monitoring                     │
├──────────────┬──────────────────────────────────────────────────┤
│              │  Sensor Data Comparison                          │
│  📍 Sensors  │  [Filter Quality: 🟢 Good 🟡 Uncertain 🔴 Bad]  │
│              │                                                  │
│  □ Site A    │     ┌─────────────────────────────────┐         │
│    □ Level   │     │                                 │         │
│    ☑ Flow    │     │   📈 Time Series Chart         │         │
│              │     │   (Multiple lines with          │         │
│  □ Site B    │     │    colored quality dots)        │         │
│    ☑ Level   │     │                                 │         │
│    □ Temp    │     │   - Lines show trends           │         │
│              │     │   - Dots show data quality      │         │
│              │     │                                 │         │
│              │     └─────────────────────────────────┘         │
│              │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

## Design Rationale

**Sidebar for sensor selection** - Always visible (sticky), lets technicians quickly toggle sensors without dropdown menus or hidden navigation.

**Multi-line chart** - Overlays multiple sensors for direct comparison. Different colors keep each sensor distinct. Technicians can literally see if readings diverge.

**Quality dots on data points** - Instead of separate tables or color-coded lines, green/yellow/red dots show quality status directly on each reading. See trend and quality together in context.

**Filter buttons** - Toggle quality levels (Good/Uncertain/Bad) to focus on what matters. Troubleshooting? Hide good readings. Everything working? Turn off the noise.

## What This Solves

| Technician Need          | Solution                                                             |
| ------------------------ | -------------------------------------------------------------------- |
| Monitor abnormal signals | Quality indicators (🟢🟡🔴) show data quality at a glance            |
| Compare between sensors  | Multi-line chart overlays all selected sensors                       |
| See trends over time     | Time series chart with proper timestamps                             |
| Verify auto-tagged data  | Visual quality dots let you judge if "bad" data actually looks wrong |
| Handle lots of data      | Optimized rendering keeps UI responsive                              |

## Performance Optimizations

Initial version froze the UI when clicking sensors with large datasets. Fixed with three changes:

**1. Map-based indexing** - Pre-index data points by timestamp using JavaScript Maps for O(1) lookups instead of O(N) array searches. Changed complexity from O(N × M × P) to O(N × M).

**2. React 18's useTransition** - Wrapped sensor selection in `useTransition` so checkboxes respond instantly while chart updates in background. Shows loading indicator during processing, previous chart stays visible.

**3. Smart memoization** - Used `useMemo` so expensive calculations only run when data actually changes, not on every render.

**Result**: Before = click → freeze → wait. After = click → instant feedback → smooth update. App stays responsive even with hundreds of data points.

## Future Enhancements

For production, I'd add: **Date range controls** for zooming (weeks vs minutes), **Export to CSV**, **Alert thresholds** (visual markers for out-of-range values), and **Mobile responsive layout**.

This prototype demonstrates core UX patterns and solves the immediate problem: technicians need to quickly compare sensors and identify data quality issues.
