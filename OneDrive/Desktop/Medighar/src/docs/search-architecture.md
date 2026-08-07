# Search Architecture

This document explains how search works across Medighar: the Global
Command Palette (Ctrl/Cmd+K or `/`) and the Site Search page (`/search`).
Both are two UIs over **one** underlying search pipeline — there is no
separate data source, ranking logic, or filtering logic for either.

## Layered architecture

Search follows the same layering as the rest of the app: