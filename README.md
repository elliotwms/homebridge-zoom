# Homebridge Platform Plugin Template

This plugin exposes your Zoom meeting status as a Homekit switch accessory. When in a meeting the switch is set to on, when out of a meeting the switch is set to off.

This extremely work-in-progress plugin should not be used by anyone, and requires you to set up a webhook-only Zoom app in your account, as well as expose an endpoint which can be called by Zoom (default `localhost:9666`, though the port can be configured in the settings).
