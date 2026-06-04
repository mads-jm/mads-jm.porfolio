---
title: Not a workspace, a reflex
date: 2026-06-03
type: devlog
project: pour
tags: [rust, tui, obsidian, capture]
summary: Why pour exists, and why it lives one keystroke from wherever I already am.
publish: true
---

Obsidian is a beautiful, sprawling garden for the mind. The trouble is that
getting to it takes too long. Switching apps, finding the right folder, opening
the daily note, formatting the frontmatter by hand. None of that is the thought.
It's the tax you pay before you're allowed to keep the thought.

That friction was already there in how I logged my life. Obsidian just made it
impossible to ignore. When you're dialing in a shot or standing in a crowd, your
brain works in seconds, not minutes. If logging a thought takes longer than the
thought itself, the thought dies. That's the one problem pour exists to kill.

> [!quote]
> Pour is not a workspace. It is a reflex.

## Why coffee came first

The first module was `pour coffee`, and that wasn't an accident. Years behind a
bar taught me that a good pour is mostly care: a small handful of variables (bean,
dose, ratio, method) handled with attention, over and over, until the result is
yours. That's the ethos I wanted in software. Fill five fields, hit submit, get
back to the cup. The intentionality *is* the feature. I want to write more about
the things that bring me joy, and for that the tool has to get out of the way
entirely.

## Why it lives in the terminal

I love a good UI. I really do. But a terminal sits closer to the keyboard than any
UI ever will, and every app switch is a small charge against your attention.
`pour coffee` is three keystrokes from whatever I was already doing. No cold-start
launch, no folder to find, no schema to format by hand. Capture first, make sense
of it on Sunday.

## The part I'm quietly proud of

It isn't anything you see on screen. Modules, fields, paths, templates,
conditional visibility: all of it is declared in TOML, none of it hardcoded.
Which means pour isn't really *my* tool. In someone else's hands, with a different
vault and a different set of obsessions, it becomes a different instrument
entirely. I shipped a coffee logger. Someone with a climbing habit ships a send
log, someone managing a condition ships a symptom tracker, and neither of them
touches a line of Rust.

Everything it writes is plain Markdown and YAML in a folder I own. No proprietary
database, no subscription holding my memories hostage. That's the same conviction
behind [[on owning your words]], and the same reason this whole space is
[[planting a digital garden|grown in git]]. The cup is empty by noon. The note
outlives whatever app rendered it.
