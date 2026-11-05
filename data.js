const CHECKLIST_DATA = [
  {
    id: "prep",
    label: "Prep",
    icon: "clipboard-list",
    sections: [
      {
        key: "plan",
        title: "Script & planning",
        dept: "direction",
        items: [
          { text: "Final script locked, copies for director, camera, sound and each actor", dept: "direction" },
          { text: "Detailed shot list printed, one copy per key crew member", dept: "direction" },
          { text: "Shooting schedule made and shared (suggested order is in the Scenes tab)", dept: "production" },
          { text: "Call times set for everyone, with a 30-minute buffer", dept: "production" },
          { text: "Closing Bible verse chosen and spelled correctly", dept: "direction" },
          { text: 'Musical "Dramusnya" footage planned: who shoots it, when, where (the script does not cover it)', dept: "direction" },
          { text: "Backup plan for weather, a late actor, or a location that falls through", dept: "production" }
        ]
      },
      {
        key: "perm",
        title: "Permissions",
        dept: "production",
        items: [
          { text: "Dorm management permission to film (rooms, CWS, balcony, hallway)", dept: "production" },
          { text: "Permission for fog and strobe indoors. Ask about smoke detectors and never tamper with fire-safety equipment", dept: "safety" },
          { text: "Drone flight permission (building management and local rules)", dept: "camera" },
          { text: "Permission from everyone on camera, including extras and the parents' home", dept: "production" },
          { text: "Music and SFX licenses checked and saved in one folder", dept: "sound" }
        ]
      },
      {
        key: "cast",
        title: "Cast",
        dept: "cast",
        items: [
          { text: "Kevin confirmed, script learned, wardrobe agreed", dept: "cast" },
          { text: "Glorion confirmed", dept: "cast" },
          { text: "Malvin confirmed", dept: "cast" },
          { text: "Jansen confirmed, costume fitted", dept: "cast" },
          { text: "Papa (Joseph) and Mama (Aurel) confirmed, with home location and time slot", dept: "cast" },
          { text: "Rehearsed: Scene 3 balcony explosion and broom, Scene 5 toast and 4th-wall speech", dept: "direction" },
          { text: "Jansen's closing lines memorized (or on cue cards), V.O. session scheduled", dept: "cast" }
        ]
      },
      {
        key: "crew",
        title: "Crew (put a name on each)",
        dept: "production",
        items: [
          { text: "Director", dept: "direction" },
          { text: "Camera / DOP", dept: "camera" },
          { text: "Gimbal and slider operator", dept: "camera" },
          { text: "Lighting and grip", dept: "lighting" },
          { text: "Sound recordist", dept: "sound" },
          { text: "Art, props and wardrobe", dept: "art" },
          { text: "FX operator (fog, strobe, flicker, thunder flash)", dept: "lighting" },
          { text: "Drone pilot", dept: "camera" },
          { text: "Continuity and slate", dept: "direction" },
          { text: "Runner (food, water, charging, moving gear)", dept: "production" }
        ]
      },
      {
        key: "recce",
        title: "Location recce",
        dept: "production",
        items: [
          { text: "Kevin's room: outlets, window, balcony door, space for gimbal and slider", dept: "camera" },
          { text: "CWS: window for the sticky-note tree, power for fairy lights, room for the 3-shot", dept: "art" },
          { text: "Hallway light checked for the door rim in Scenes 2 and 4", dept: "lighting" },
          { text: "Balcony: safe spot for fog and strobe, rain shelter for the camera", dept: "safety" },
          { text: "Parents' warm home set: tree, lights, quiet space", dept: "art" },
          { text: "Drone take-off point and flight path", dept: "camera" }
        ]
      },
      {
        key: "props",
        title: "Props",
        dept: "art",
        items: [
          { text: "DVD (hero prop, wiped clean) and DVD holder", dept: "art" },
          { text: "Totebags (2) filled with decoration items and cables", dept: "art" },
          { text: "Laptop with a DVD drive or a working workaround, plus charger", dept: "art" },
          { text: "Projector, HDMI cable, power cable, stand", dept: "art" },
          { text: "Cocoa mugs (4+ spare), instant cocoa, thermos of hot water", dept: "art" },
          { text: "Neon sticky notes, hundreds, yellow as the hero color", dept: "art" },
          { text: "Yellow star-shaped sticky note (hero) plus 2 spares", dept: "art" },
          { text: "Thick black marker plus a spare", dept: "art" },
          { text: "Butter cookies and marshmallows, plenty for repeat takes", dept: "art" },
          { text: "Fairy lights (amber), spare batteries and extension cords", dept: "lighting" },
          { text: 'Masking tape ("lakban"), visible in Scenes 2 and 4', dept: "art" },
          { text: "Broom (light and safe)", dept: "art" },
          { text: "Kevin's desk: PPTI textbooks, notebooks, natural mess", dept: "art" },
          { text: "Kevin's phone at full charge and a backup phone", dept: "art" },
          { text: "Glycerin and water spray bottle for wet glass", dept: "art" },
          { text: "Decoration items for the common room", dept: "art" }
        ]
      },
      {
        key: "ward",
        title: "Wardrobe",
        dept: "art",
        items: [
          { text: "Kevin: main outfit, two identical copies if possible", dept: "art" },
          { text: "Glorion and Malvin: casual dorm wear, matched across scenes", dept: "art" },
          { text: 'Jansen: "funny Santa" costume, lightly scorched and dusty', dept: "art" },
          { text: "Papa and Mama: warm festive outfits for the home call", dept: "art" }
        ]
      }
    ]
  },
  {
    id: "gear",
    label: "Gear",
    icon: "camera",
    sections: [
      {
        key: "cam",
        title: "Camera",
        dept: "camera",
        items: [
          { text: "Sony a6700 body", dept: "camera" },
          { text: "3+ charged batteries and a charger", dept: "camera" },
          { text: "2+ formatted memory cards, card reader, laptop with free space", dept: "camera" },
          { text: "Sirui 35mm T1.2", dept: "camera" },
          { text: "Tamron 17-70mm f/2.8", dept: "camera" },
          { text: "1/4 Black Pro-Mist (clean, right size or step ring)", dept: "camera" },
          { text: "Lens cloth, blower, spare cloth for rain and glycerin", dept: "camera" },
          { text: "Clapper or slate", dept: "camera" },
          { text: "Monitor or loupe, if you have one", dept: "camera" }
        ]
      },
      {
        key: "sup",
        title: "Support",
        dept: "camera",
        items: [
          { text: "Heavy tripod with fluid head", dept: "camera" },
          { text: "Gimbal, charged and balanced for the a6700 and lens", dept: "camera" },
          { text: "Slider", dept: "camera" },
          { text: "Boom pole (fake-drone fallback)", dept: "camera" },
          { text: "Sandbags, gaffer tape, cable ties", dept: "lighting" }
        ]
      },
      {
        key: "light",
        title: "Lighting",
        dept: "lighting",
        items: [
          { text: "LED panels (2+) with diffusion and stands", dept: "lighting" },
          { text: "LED tube", dept: "lighting" },
          { text: "Amber/CTO, red and blue/cyan gels", dept: "lighting" },
          { text: "Black cloth (negative fill) and foam-core bounce", dept: "lighting" },
          { text: "Flags and cutters", dept: "lighting" },
          { text: "Dimmer, or a helper assigned to flick lights on cue", dept: "lighting" },
          { text: "Strobe or par light for the explosion (low flash rate)", dept: "lighting" },
          { text: "Fog machine, fluid, and a fire extinguisher nearby", dept: "safety" },
          { text: "Extension cords and power strips (check the building circuit load)", dept: "lighting" },
          { text: "Gaffer tape and clothespins", dept: "lighting" }
        ]
      },
      {
        key: "aud",
        title: "Audio",
        dept: "sound",
        items: [
          { text: "Lavalier mics (2-3) with charged batteries", dept: "sound" },
          { text: "Shotgun mic and boom pole", dept: "sound" },
          { text: "Recorder (48 kHz / 24-bit), headphones, spare batteries, cards", dept: "sound" },
          { text: "Windshield for any exterior takes", dept: "sound" }
        ]
      },
      {
        key: "drone",
        title: "Drone",
        dept: "camera",
        items: [
          { text: "Lito X1, fully charged, 3+ batteries", dept: "camera" },
          { text: "Spare propellers, SD card", dept: "camera" },
          { text: "Controller charged, firmware checked", dept: "camera" },
          { text: "Flight area cleared, spotter assigned", dept: "safety" }
        ]
      },
      {
        key: "misc",
        title: "Everything else",
        dept: "production",
        items: [
          { text: "First-aid kit", dept: "safety" },
          { text: "Water, snacks and meals for cast and crew", dept: "production" },
          { text: "Trash bags and cleaning supplies (fog, glycerin, crumbs)", dept: "production" },
          { text: "Power bank for phones", dept: "production" }
        ]
      }
    ]
  },
  {
    id: "day",
    label: "Shoot day",
    icon: "sun",
    preset: true,
    sections: [
      {
        key: "eve",
        title: "Night before",
        dept: "production",
        items: [
          { text: "Charge camera batteries, gimbal, mics, recorder, drone, phones, LEDs", dept: "production" },
          { text: "Format cards and clear laptop space", dept: "camera" },
          { text: "Camera set to the preset above", dept: "camera" },
          { text: "Save a 60p slow-motion preset for Scene 5 (shutter 1/120)", dept: "camera" },
          { text: "Pack the bags using the Gear tab", dept: "production" },
          { text: "Re-read tomorrow's shots and mark the hardest ones", dept: "direction" },
          { text: "Confirm cast and crew call times", dept: "production" },
          { text: "Check the weather and the drone forecast (dry, low wind)", dept: "production" }
        ]
      },
      {
        key: "setup",
        title: "Every setup",
        dept: "direction",
        items: [
          { text: "White balance 3800K and Pro-Mist on", dept: "camera" },
          { text: "Focus, aperture, shutter, ISO checked", dept: "camera" },
          { text: "Exposure: skin about 50-55% on the waveform, no clipped highlights, no crushed shadows", dept: "camera" },
          { text: "Frame, headroom, eyelines and background clutter checked", dept: "camera" },
          { text: "Lighting checked: key, fill, backlight, negative fill, flicker and FX cues", dept: "lighting" },
          { text: "Wet-glass spray, props in place, continuity against the last shot", dept: "art" },
          { text: "Mic check, headphones on, fridge/AC/fans off, phones silenced", dept: "sound" },
          { text: "Slate: scene, shot, take", dept: "direction" },
          { text: 'Roll camera, roll sound, "action", let it run 3-5 seconds after the last line', dept: "direction" },
          { text: "After each take: director's OK, tick the shot, note the best take", dept: "direction" },
          { text: "60 seconds of room tone at every location", dept: "sound" }
        ]
      },
      {
        key: "safe",
        title: "Safety",
        dept: "safety",
        items: [
          { text: "Strobe at 3 flashes per second or less", dept: "safety" },
          { text: "Fog in short bursts, room ventilated, permission given", dept: "safety" },
          { text: "Fire extinguisher nearby, fire-safety equipment untouched", dept: "safety" },
          { text: "Cables taped and flagged, none across walkways", dept: "safety" },
          { text: "Power load checked, no overloaded strips", dept: "safety" },
          { text: "Wet floors dried (glycerin, water, cocoa)", dept: "safety" },
          { text: "Dry ice only with gloves, ventilation and a trained handler", dept: "safety" },
          { text: "Drone: dry weather, spotter, clear area, never over people", dept: "safety" },
          { text: "Balcony: nobody leans on the railing", dept: "safety" },
          { text: "Water and breaks for the crew", dept: "production" }
        ]
      }
    ]
  },
  {
    id: "scenes",
    label: "Scenes",
    icon: "clapperboard",
    order: true,
    sections: [
      {
        key: "s1",
        tag: "Scene 1",
        title: "Balkon / jendela, sore hujan",
        dept: "camera",
        prep: "Wet-glass spray, cyan backlight, negative fill, phone at full brightness, tracking markers on the phone corners",
        items: [
          { text: "1.1 OTS behind the shoulder: phone screen with Papa and Mama", dept: "camera" },
          { text: '1.2 MCU Kevin: "Haloo paa-maa"', dept: "camera" },
          { text: "1.3 Parents' footage at the warm home set (Papa, Mama, tree, lights)", dept: "direction" },
          { text: '1.4 MCU Kevin: the fake smile ("Seru dong Maah...")', dept: "camera" },
          { text: '1.5 Slow push-in: the drop, smile fades, "Huftttt..."', dept: "camera" },
          { text: "1.6 Optional: reverse through the wet glass from the balcony", dept: "camera" },
          { text: "Phone-screen flicker tested, or screen replacement planned", dept: "camera" },
          { text: "Room tone recorded at the window", dept: "sound" }
        ]
      },
      {
        key: "s2",
        tag: "Scene 2",
        title: "Kamar Kevin, sore",
        dept: "camera",
        prep: "Messy desk, neon sticky notes visible and lit, PPTI books, hallway light ready for the door rim",
        items: [
          { text: "2.1 Gimbal tracking: Kevin walks in", dept: "camera" },
          { text: "2.2 Wide, high angle: Kevin alone on the bed", dept: "camera" },
          { text: "2.3 Pan and track: Glorion and Malvin enter, hard hallway rim light", dept: "camera" },
          { text: '2.4 MCU Kevin and reverse MCU Glorion: "Aman taah, Kev?" / "Aman ajaa lohh"', dept: "camera" },
          { text: "2.5 Insert with rack focus onto the neon sticky notes (rack practiced)", dept: "camera" },
          { text: "2.6 Two-shot: Malvin and Glorion trade a glance, lakban request", dept: "camera" },
          { text: "2.7 Wide, high angle: door closes, light fades to shadow", dept: "camera" },
          { text: "Foley recorded: totebags, cables, door, bed creak", dept: "sound" },
          { text: "Room tone recorded", dept: "sound" }
        ]
      },
      {
        key: "s3",
        tag: "Scene 3",
        title: "Kamar / balkon, sore menjelang malam",
        dept: "direction",
        prep: "Safety briefing, fog tested, strobe at 3 flashes per second or less, flicker helper, thunder-flash LED, broom, DVD, projector set up, Jansen costume scorched",
        items: [
          { text: "Safety briefing done with the whole crew", dept: "safety" },
          { text: "3.1 MCU Kevin at the desk: the complaint", dept: "camera" },
          { text: "3.2 Whip pan to the balcony door, thunder flash, lamp flicker", dept: "camera" },
          { text: "3.3 Static wide: glass door covered in smoke, red-gold light", dept: "camera" },
          { text: "3.4 ECU Kevin's eyes", dept: "camera" },
          { text: "3.5 Kevin approaches the door", dept: "camera" },
          { text: "3.6 ECU insert: hand on the handle", dept: "camera" },
          { text: "3.7 KABOOM: low-angle wide, strobe, fog, door bursts open (fog-only rehearsal first)", dept: "camera" },
          { text: "3.8 Reveal: Jansen on the balcony floor", dept: "camera" },
          { text: '3.9 MCU Jansen at floor level: "Aduh... encok gue..."', dept: "camera" },
          { text: '3.10 MS Kevin with the broom: "WOIIII! KAU SIAPA?!"', dept: "camera" },
          { text: "3.11 Two-shot standoff: Jansen dusts off his coat", dept: "camera" },
          { text: "3.12 MCU Jansen: the solution, backlit, 4:1 contrast", dept: "camera" },
          { text: '3.13 MCU Kevin: "kok tau?!" / "video apaan?"', dept: "camera" },
          { text: "3.14 ECU insert: the DVD handoff", dept: "art" },
          { text: "3.15 MS / OTS: Kevin sets up laptop and projector", dept: "camera" },
          { text: "3.16 ECU: projector beam into the lens, Pro-Mist bloom", dept: "camera" },
          { text: "3.17 Static wall shot, the lead-in to the musical", dept: "camera" },
          { text: "Wild lines recorded for dialogue hit by fog or wind", dept: "sound" },
          { text: "Room ventilated, floors checked for slips", dept: "safety" }
        ]
      },
      {
        key: "s4",
        tag: "Scene 4",
        title: "Kamar Kevin, malam",
        dept: "camera",
        prep: "Projector dimmer cue ready, smoke cleared, clean plate of the empty room planned",
        items: [
          { text: '4.1 CU Kevin: the awe, projector dims, "WUOHHHH..."', dept: "camera" },
          { text: '4.2 Two-shot and MCU Jansen: "Gimana, seru gaa?" and the silent smile', dept: "camera" },
          { text: "4.3 Door knock and Glorion's line", dept: "camera" },
          { text: "4.4 Pan and rack focus: Jansen disappears (clean plate recorded)", dept: "camera" },
          { text: "Whoosh or wind-chime reference noted for post", dept: "sound" },
          { text: "Room tone recorded", dept: "sound" }
        ]
      },
      {
        key: "s5",
        tag: "Scene 5",
        title: "Common room (CWS), malam",
        dept: "art",
        prep: "Room fully dressed, fairy lights on, sticky-note tree on the window, backlight outside the window, hot cocoa and snacks ready",
        items: [
          { text: "5.1 Gimbal push-in and pedestal up: the reveal", dept: "camera" },
          { text: "5.2 Frontal MCU Kevin: teary, fairy-light catchlights", dept: "camera" },
          { text: "5.3 Wide and tilt: the sticky-note tree, backlit neon", dept: "camera" },
          { text: '5.4 OTS and ECU: Kevin writes "NOT JUST STORY" on the star', dept: "art" },
          { text: "5.5 Tilt up: the star goes on top, backlit cyan", dept: "camera" },
          { text: "5.6 Wide 3-shot at 60p: the toast", dept: "camera" },
          { text: '5.7 Dolly out: Jansen steps in, "Sederhana, kan? Tapi hangat."', dept: "camera" },
          { text: "5.8 B-roll A at 60p: laughing, marshmallows, bokeh (shoot plenty)", dept: "camera" },
          { text: "5.9 B-roll B: hand on the mug, glide up to Kevin's smile", dept: "camera" },
          { text: "5.10 MCU Jansen: the closing smile", dept: "camera" },
          { text: "5.11 Dolly back through the window (match-cut plan confirmed)", dept: "camera" },
          { text: "Jansen's V.O. recorded cleanly in a quiet room", dept: "sound" },
          { text: "Foley recorded: mug clinks, paper peel and press, marker squeak", dept: "sound" },
          { text: "Room tone recorded", dept: "sound" }
        ]
      },
      {
        key: "sx",
        tag: "Exterior",
        title: "Drone and title cards",
        dept: "camera",
        prep: "Dry night, low wind, CWS window lit, pilot and spotter ready, permission confirmed",
        items: [
          { text: "5.12 Drone pull-back from the glowing window (or fake-drone fallback on a boom pole)", dept: "camera" },
          { text: "Extra drone passes at 2-3 heights", dept: "camera" },
          { text: "Clean plate without rain for the VFX rain overlay", dept: "camera" },
          { text: "5.13 Closing Bible verse text ready for the edit", dept: "direction" },
          { text: '5.14 Title card "NOT JUST STORY"', dept: "direction" }
        ]
      }
    ]
  },
  {
    id: "wrap",
    label: "Wrap & post",
    icon: "archive",
    sections: [
      {
        key: "wrap",
        title: "End of every shoot day",
        dept: "production",
        items: [
          { text: "Back up all footage to two places before formatting any card", dept: "camera" },
          { text: "Spot-check clips for focus, exposure and sound", dept: "camera" },
          { text: "Mark the best takes on the shot list", dept: "direction" },
          { text: "Return borrowed props and clean the location", dept: "art" },
          { text: "Charge all batteries for tomorrow", dept: "production" },
          { text: "Note missing shots and pickups", dept: "direction" },
          { text: "Thank the cast and crew", dept: "production" }
        ]
      },
      {
        key: "snd",
        title: "Sound",
        dept: "sound",
        items: [
          { text: "Room tone from every location (60 seconds)", dept: "sound" },
          { text: "Wild lines for noisy scenes", dept: "sound" },
          { text: "Phone-call dialogue clean, EQ 300 Hz to 3.4 kHz in post", dept: "sound" },
          { text: "Foley: footsteps, door, bed, totebags, cables, broom", dept: "sound" },
          { text: "Foley: mug clinks, paper peel and press, marker squeak, DVD tray", dept: "sound" },
          { text: "SFX collected: indoor rain, thunder, wind, explosion, projector hum, whoosh", dept: "sound" },
          { text: "Jansen V.O. recorded", dept: "sound" },
          { text: "Music chosen: melancholic piano (1), horror drone (3), comedy cue (3), warm piano and swell (5), final piano note", dept: "sound" },
          { text: "All licenses saved in one folder", dept: "production" }
        ]
      },
      {
        key: "post",
        title: "Post-production",
        dept: "direction",
        items: [
          { text: "Footage organized by scene and shot", dept: "direction" },
          { text: "Dialogue synced and audio cleaned", dept: "sound" },
          { text: "Rough cut, then picture lock", dept: "direction" },
          { text: "Phone screen replaced in Scene 1, if needed", dept: "camera" },
          { text: "Rain overlay on the drone shot", dept: "camera" },
          { text: "Disappearance dissolve and shimmer (shot 4.4)", dept: "camera" },
          { text: "Color grade: cold exteriors, warm interiors, warmer scene by scene", dept: "camera" },
          { text: "Sound design and mix, phone EQ, Jansen V.O. clarity", dept: "sound" },
          { text: "Music placement and levels, rain crescendo at the end", dept: "sound" },
          { text: "Closing verse and title card", dept: "direction" },
          { text: "Export test on a phone, a laptop and a TV", dept: "direction" }
        ]
      }
    ]
  }
];

const SUGGESTED_ORDER = [
  "Parents' footage at the warm home set",
  "Scene 2 (Kevin's room, clean), then Scene 4 in the same room",
  "Scene 3 last in that room: fog, strobe, flicker",
  "Scene 1 at the window after dark, with rain spray on the glass",
  "Scene 5 in the CWS: coverage, then 60p B-roll, then the toast",
  "Drone and exterior on a dry night",
  "Pickups, room tone, foley, V.O."
];

const CAMERA_PRESET = [
  { label: "Profile", value: "S-Log3" },
  { label: "ISO", value: "800/2500" },
  { label: "Resolution", value: "4K 23.98p" },
  { label: "Slow-mo", value: "4K 60p" },
  { label: "Shutter", value: "1/48 (1/120 at 60p)" },
  { label: "White balance", value: "3800K, locked" },
  { label: "Filter", value: "1/4 Black Pro-Mist" },
  { label: "Skin exposure", value: "50-55% waveform" }
];

const DEPARTMENTS = [
  { id: "all", label: "All Departments", icon: "layers" },
  { id: "camera", label: "Camera / DOP", icon: "video" },
  { id: "lighting", label: "Lighting & Grip", icon: "zap" },
  { id: "sound", label: "Sound", icon: "mic" },
  { id: "direction", label: "Direction & Slate", icon: "clapperboard" },
  { id: "art", label: "Art & Props", icon: "palette" },
  { id: "cast", label: "Cast", icon: "users" },
  { id: "safety", label: "Safety", icon: "shield-alert" },
  { id: "production", label: "Production", icon: "briefcase" }
];

