---
title: Keeping a distributed queue in sync without a server round-trip
date: 2026-05-28
type: devlog
project: whatnext
tags: [distributed-systems, rust, audio]
summary: First real design note for WhatNext — reconciling queue state across clients.
publish: true
---

The core problem in WhatNext: multiple people add tracks to a shared queue from
different devices, and everyone should see the same order *fast*, without round-tripping
to a central server on every reorder.

## The approach I'm testing

A CRDT-ish ordered list keyed by fractional indices. Each insert picks a position
*between* two existing keys, so two clients inserting concurrently rarely collide.

| Strategy | Conflict rate | Complexity |
| --- | --- | --- |
| Integer indices + lock | high | low |
| Fractional indexing | low | medium |
| Full CRDT (RGA) | none | high |

Starting with fractional indexing — it's the cheapest thing that survives concurrent
edits. I'll revisit a full CRDT only if rebalancing becomes a problem.

> [!warning] Open question
> Fractional keys can run out of precision after many inserts between the same two
> items. Need a rebalance pass. Punting on that until I see it in practice.
