# Unified governance standard

Every catalog adapter emits the same fields: `id`, `name`, `description`, `group`, `plugin`,
`source`, `path`, `owner`, `writable`, and `observability`. IDs combine the plugin, declared name,
and a stable digest of the canonical source path so duplicate declared names cannot overwrite.

Every lifecycle event has `skill_id`, UTC `timestamp`, `stage`, `host`, `thread`, `task`, and an
optional `reason`. Loads and invocations are separate events. Lifecycle usage counts are derived
only from events, not inferred from discovery. Inventory and count requests first scan every
accessible host-supplied root. Missing host telemetry remains `unknown`, never an inferred zero.

Policy is evaluated per skill. Plugin unavailability remains authoritative, and an individual
`disabled` result blocks that skill even when its plugin is available. A host integration must call
the `skill_check` operation before loading any governed skill's context. A disabled result blocks
only the checked skill, not its containing plugin; the registry alone cannot control a host.

Observability values:

- `observed`: the adapter or host emitted evidence.
- `unobservable`: the host exposes no supported signal.
- `unknown`: the adapter has not yet checked.

Automatic improvement is proposal-first. It may identify missing trigger phrases, absent
dependencies, weak failure handling, or overlap. Only user-owned writable skills may be changed,
and changes require validation plus an audit event.
