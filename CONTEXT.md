# clrspace

A personal browser space you navigate to shift between a scatterbrained, intuitive state and a resourceful, creative-and-executing one — by wandering through varied places that either invite a thought (expression) or offer something small to play with (consumption).

## Language

**Space**:
The single navigable world of clrspace. Contains all Spots and is affected by Toggles and Ambient Sound.
_Avoid_: canvas (reserved for a possible future drawing tool), world, map (map means something specific in wayfinder/tracker contexts).

**Spot**:
One distinct, hand-placed location within the Space that you arrive at by moving through it. Each Spot has its own visual identity (font, size, frame, etc. depending on kind).
_Avoid_: room, area, zone, node.

**Scribble Spot**:
A kind of Spot: a plain text-entry area for jotting a thought. Its content is exportable simply by being selectable text — no separate export action exists.
_Avoid_: text box, note, journal entry.

**Consumption Spot**:
A kind of Spot: houses one Mechanic (a minigame- or puzzle-like interaction) meant to be played briefly rather than authored in.
_Avoid_: game spot, puzzle room.

**Mechanic**:
The specific interactive rule-set inside a Consumption Spot (e.g. a bubble-burster, a pattern-matching puzzle). Each Consumption Spot has exactly one Mechanic; different Consumption Spots are expected to have different Mechanics from each other.

**Toggle**:
A control that changes some quality of the whole Space's presentation, not tied to any one Spot (e.g. the Color Temperature Toggle). Distinct from Ambient Sound's mute control, which only affects sound.
_Avoid_: setting, option, control (when referring to a Space-wide visual control specifically).

**Ambient Sound**:
The single looping background audio track for the Space, paired with a mute/unmute control that defaults to muted.
_Avoid_: background music (used in index.md, but "music" implies composed melody — the MVP scope is any simple looping digital sound, not necessarily musical).

**Session**:
One continuous visit to the Space, from arrival to leaving. clrspace currently has no memory across Sessions — where you were, and what you left in a Scribble Spot, does not carry over to the next Session.
_Avoid_: visit (fine informally, but Session is canonical for anything persistence-related).
