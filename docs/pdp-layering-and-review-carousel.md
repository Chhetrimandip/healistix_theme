# Layering and written reviews

Local fixes after 1_checkpoint; not pushed.

The isolated product section trapped its fixed label drawer and sticky cart bar behind later isolated photography sections. Jar label now uses a native modal dialog in the browser top layer; close/Escape restore page scrolling and opener focus. Sticky cart mounts under body with independent styling and section-unload cleanup. It hides while a native modal is open and when the primary purchase button is visible.

Written reviews now scroll horizontally in Featured and All views, with previous/next controls, position count, keyboard arrows, touch scrolling and reduced-motion support. Rating distribution, customer media grid, Write a review, native filters and pagination remain intact.

Two requested subagents implemented the independent fixes. Desktop and 390px mobile checks passed: label dialog above lower sections; Escape handling; sticky button hit-testing above reviews/FAQ; carousel navigation; photo modal; upper nine media tiles preserved. Both edited standalone scripts pass Node syntax checks.

Subscription and merchandise recommendations are in subscriptions-and-jar-rewards.md. No reward offer or subscription billing activated.
