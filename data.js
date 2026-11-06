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
    lightingPlans: [
      {
        scene: "Scene 1",
        title: "Balkon / jendela, sore hujan",
        intent: "Cool exterior separation against the phone's neutral-white face light.",
        setups: [
          {
            name: "Phone-screen key",
            details: [
              "Use a compact bi-color LED panel beside or behind the phone. Set 5600K and begin at 12-15% output.",
              "Diffuse with 1/8 grid cloth or diffusion tape. Place about 0.4 m from Kevin, camera-left at roughly 45 degrees and near eye level.",
              "The supplied plan's 43 IRE cheek value is a reference target, not a guaranteed result. Confirm the camera profile and waveform scale, then expose on the actual monitor."
            ]
          },
          {
            name: "Window backlight and negative fill",
            details: [
              "Use a 100-150W COB outside the glass, set 3800-4000K and begin at 40-50%. A 55-degree reflector is specified; place it about 2 m outside at a 30-degree rear-quarter angle toward hair and shoulders.",
              "Spray the exterior glass with a 50/50 glycerin-water mix to catch the backlight. Test a small area first and keep the floor dry and non-slip.",
              "Place a 1 x 2 m black floppy or black cloth about 1 m camera-right, opposite the phone key. The 4:1 contrast ratio is an intended look; verify it with a meter rather than assuming it from placement."
            ]
          }
        ],
        diagrams: [
          {
            title: "Main shot - phone key and wet-window backlight",
            zones: [
              { x: 24, y: 48, width: 194, height: 236, label: "BALCONY / EXTERIOR" },
              { x: 230, y: 48, width: 506, height: 236, label: "ROOM" }
            ],
            dividers: [{ x1: 224, y1: 72, x2: 224, y2: 270, label: "WET GLASS" }],
            nodes: [
              { id: "backlight", kind: "light", x: 105, y: 105, label: ["WINDOW BACKLIGHT", "3800-4000K / 40-50%"] },
              { id: "key", kind: "light", x: 280, y: 230, label: ["PHONE KEY", "5600K / 12-15%"] },
              { id: "kevin", kind: "subject", x: 390, y: 158, label: ["KEVIN", "Face toward phone key"] },
              { id: "negative", kind: "negative", x: 625, y: 158, label: ["NEGATIVE FILL", "Black / camera-right"] },
              { id: "camera", kind: "camera", x: 390, y: 315, label: ["CAMERA", "35 mm reference"] }
            ],
            links: [{ from: "backlight", to: "kevin" }, { from: "key", to: "kevin" }]
          }
        ]
      },
      {
        scene: "Scene 2",
        title: "Kamar Kevin, sore",
        intent: "Keep the room soft and subdued; make the desk practical feel like the motivation. The source plan suggests a 2:1 key-to-fill look; measure it on the actual set rather than inferring it from dimmer percentages.",
        setups: [
          {
            name: "Desk practical and room fill",
            details: [
              "Use a dimmable 3200K desk-lamp bulb at about 30%, on the desk roughly 1.2 m in front of Kevin. Protect highlight detail. The source lists below 950 on a 10-bit waveform; confirm the scope's scale before using that reference as a limit.",
              "Use a 60W panel or COB at 3200K, starting at 15%, bounced up into the ceiling from behind camera. This is a soft fill, not a second hard key; adjust until clothing and bed detail hold without flattening the scene.",
              "For the sticky-note insert, use a mini spot or snoot at 3200K, starting at 20%, about 1 m above the desk and focused only on the notes."
            ]
          },
          {
            name: "Doorway rim for shot 2.3",
            details: [
              "The shot list calls for a hard hallway rim when Glorion and Malvin enter. The source notes do not specify its fixture, color temperature, output, or distance; use the available hallway/practical source and set those values on location rather than guessing."
            ]
          }
        ],
        diagrams: [
          {
            title: "Room plan - practical, ceiling bounce and note insert",
            zones: [{ x: 24, y: 48, width: 712, height: 236, label: "KEVIN'S ROOM" }],
            dividers: [],
            nodes: [
              { id: "bounce", kind: "light", x: 112, y: 105, label: ["BOUNCE FIXTURE", "3200K / 15% start"] },
              { id: "ceiling", kind: "modifier", x: 290, y: 82, label: ["WHITE CEILING", "Bounce surface"] },
              { id: "hall", kind: "light", x: 112, y: 220, label: ["HALLWAY RIM", "Shot 2.3 / set on location"] },
              { id: "kevin", kind: "subject", x: 370, y: 160, label: ["KEVIN / BED", "Soft ambient fill"] },
              { id: "practical", kind: "practical", x: 625, y: 100, label: ["DESK PRACTICAL", "3200K / 30% start"] },
              { id: "spot", kind: "light", x: 500, y: 235, label: ["NOTE INSERT SPOT", "3200K / 20% start"] },
              { id: "notes", kind: "surface", x: 650, y: 235, label: ["STICKY NOTES", "Focus insert beam here"] },
              { id: "camera", kind: "camera", x: 370, y: 270, label: ["CAMERA", "Wide / coverage"] }
            ],
            links: [
              { from: "bounce", to: "ceiling" },
              { from: "ceiling", to: "kevin" },
              { from: "practical", to: "kevin" },
              { from: "spot", to: "notes" }
            ]
          }
        ]
      },
      {
        scene: "Scene 3",
        title: "Kamar / balkon, sore menjelang malam",
        intent: "Create a high-contrast horror-comedy pivot (the source plan calls for about 8:1) and keep the balcony strobe/fog cue separate from the projector-beam insert. Measure the contrast on set.",
        setups: [
          {
            name: "Balcony reveal - shots 3.2-3.13",
            details: [
              "Use a 150-200W COB with a lightning/strobe effect alternating 3200K amber and 5600K white. The supplied plan says 100% peak; treat that as a starting effect level, not an exposure value.",
              "Mount low on a secure stand, about 0.5 m high and tilted upward around 20 degrees toward the balcony door. Keep the flash rate at 3 flashes per second or less, warn the cast and crew, and allow anyone sensitive to flashing light to opt out.",
              "Place the water-based fog machine near the fixture and cue a short burst as the door opens. Confirm location permission, ventilation and fire-safety requirements first; never disable or obstruct detectors or safety equipment."
            ]
          },
          {
            name: "Projector-beam insert - shot 3.16 (separate setup)",
            details: [
              "Use a practical projector or a focused 5600K LED spotlight with a Fresnel. Put it on Kevin's desk and aim across the room, past Kevin's profile and into the lens.",
              "This is a separate insert, not the balcony strobe position. There is no specified output level; focus and expose the beam on the actual camera monitor."
            ]
          }
        ],
        diagrams: [
          {
            title: "Balcony reveal - low strobe and fog at the open door",
            zones: [
              { x: 24, y: 48, width: 462, height: 236, label: "ROOM" },
              { x: 500, y: 48, width: 236, height: 236, label: "BALCONY" }
            ],
            dividers: [{ x1: 493, y1: 82, x2: 493, y2: 270, label: "DOOR" }],
            nodes: [
              { id: "camera", kind: "camera", x: 90, y: 260, label: ["CAMERA", "Low-angle wide"] },
              { id: "kevin", kind: "subject", x: 330, y: 205, label: ["KEVIN", "Room / frame left"] },
              { id: "jansen", kind: "subject", x: 515, y: 195, label: ["JANSEN", "Reveal on balcony floor"] },
              { id: "strobe", kind: "light", x: 635, y: 100, label: ["STROBE COB", "3200K / 5600K FX"] },
              { id: "fog", kind: "atmosphere", x: 635, y: 255, label: ["FOG MACHINE", "Short door-open cue"] }
            ],
            links: [{ from: "strobe", to: "jansen" }]
          },
          {
            title: "Separate insert - projector beam passes Kevin into lens",
            zones: [{ x: 24, y: 48, width: 712, height: 236, label: "ROOM / INSERT SETUP" }],
            dividers: [],
            nodes: [
              { id: "projector", kind: "light", x: 105, y: 165, label: ["PROJECTOR", "5600K beam"] },
              { id: "kevin", kind: "subject", x: 370, y: 165, label: ["KEVIN PROFILE", "Beam passes behind"] },
              { id: "camera", kind: "camera", x: 655, y: 165, label: ["LENS", "Beam aimed into lens"] }
            ],
            links: [{ from: "projector", to: "camera" }]
          }
        ]
      },
      {
        scene: "Scene 4",
        title: "Kamar Kevin, malam",
        intent: "A controlled, gradual fall from bright projector awe to a quiet low-key room.",
        setups: [
          {
            name: "Projector-wall bounce",
            details: [
              "Use a flexible LED mat or soft panel at 4500K beside the projection surface. Bounce it off a 1 x 1 m white reflector placed flat against the wall, from the projection-wall position toward Kevin.",
              "Begin at 35% and manually fade to 5% over 4 seconds as the projector powers down. These are control starting points; make the fade smooth and check the recorded exposure.",
              "The supplied exposure references are 46 IRE at playback and 18 IRE at the end. Confirm the S-Log3 profile and waveform scale on the camera/monitor before using those values."
            ]
          }
        ],
        diagrams: [
          {
            title: "Bounce path - source to reflector to Kevin",
            zones: [{ x: 24, y: 48, width: 712, height: 236, label: "KEVIN'S ROOM" }],
            dividers: [{ x1: 620, y1: 72, x2: 620, y2: 270, label: "PROJECTION WALL" }],
            nodes: [
              { id: "camera", kind: "camera", x: 105, y: 245, label: ["CAMERA", "Close-up"] },
              { id: "kevin", kind: "subject", x: 350, y: 170, label: ["KEVIN", "Reaction close-up"] },
              { id: "bounce", kind: "modifier", x: 505, y: 170, label: ["WHITE REFLECTOR", "1 x 1 m / against wall"] },
              { id: "key", kind: "light", x: 660, y: 245, label: ["SOFT LED KEY", "4500K / 35% to 5%"] },
              { id: "screen", kind: "surface", x: 660, y: 95, label: ["PROJECTION", "Wall / screen"] }
            ],
            links: [{ from: "key", to: "bounce" }, { from: "bounce", to: "kevin" }]
          }
        ]
      },
      {
        scene: "Scene 5",
        title: "Common room (CWS), malam",
        intent: "Soft warm faces and practical bokeh inside, with a cooler window backlight on the sticky-note tree. The source plan suggests a soft 2:1 look; check the actual face-side contrast on set.",
        setups: [
          {
            name: "Warm book-light key",
            details: [
              "Use a 100-200W COB at 3000K, starting at 45%. Aim it into a 1.2 x 1.2 m white foam-core bounce, then pass the reflected light through a 1.2 x 1.2 m frame of unbleached muslin or full grid cloth.",
              "Place diffusion about 45 degrees to the bounce board; position the book light about 1.8 m from the cast at a 45-degree key angle. The sequence is COB -> bounce -> diffusion -> actors.",
              "This is a soft-wrap reference, not a guaranteed 2:1 ratio. Use a meter and adjust to the actual room and camera exposure."
            ]
          },
          {
            name: "Background and window",
            details: [
              "Place three strands of 2800K fairy lights on the background pillars, shelving or window edges, at least 2-3 m behind the actors for separation and bokeh.",
              "Use a 100W COB outside the CWS window at 3800K, starting at 60%, aimed inward through the sticky-note tree. Confirm the paper and window do not clip and keep the exterior setup secure."
            ]
          }
        ],
        diagrams: [
          {
            title: "Book-light path and separate window backlight",
            zones: [
              { x: 24, y: 48, width: 548, height: 236, label: "COMMON ROOM" },
              { x: 588, y: 48, width: 148, height: 236, label: "WINDOW / EXT." }
            ],
            dividers: [{ x1: 580, y1: 76, x2: 580, y2: 270, label: "CWS GLASS" }],
            nodes: [
              { id: "cob", kind: "light", x: 100, y: 110, label: ["BOOK-LIGHT COB", "3000K / 45% start"] },
              { id: "bounce", kind: "modifier", x: 245, y: 110, label: ["WHITE FOAM CORE", "1.2 x 1.2 m bounce"] },
              { id: "diffusion", kind: "modifier", x: 315, y: 235, label: ["MUSLIN / GRID", "1.2 x 1.2 m diffusion"] },
              { id: "actors", kind: "subject", x: 445, y: 165, label: ["CAST", "1.8 m from key"] },
              { id: "fairy", kind: "practical", x: 445, y: 75, label: ["FAIRY LIGHTS", "2800K / 2-3 m back"] },
              { id: "tree", kind: "surface", x: 565, y: 235, label: ["STICKY-NOTE TREE", "Backlit at window"] },
              { id: "window", kind: "light", x: 685, y: 100, label: ["WINDOW COB", "3800K / 60% start"] },
              { id: "camera", kind: "camera", x: 445, y: 280, label: ["CAMERA", "24 / 35 mm reference"] }
            ],
            links: [
              { from: "cob", to: "bounce" },
              { from: "bounce", to: "diffusion" },
              { from: "diffusion", to: "actors" },
              { from: "window", to: "tree" }
            ]
          }
        ]
      }
    ],
    sections: [
      {
        key: "s1",
        tag: "Scene 1",
        title: "Balkon / jendela, sore hujan",
        dept: "camera",
        prep: "Wet-glass spray, cyan backlight, negative fill, phone at full brightness, tracking markers on the phone corners",
        items: [
          { text: "1.1 OTS behind the shoulder: phone screen with Papa and Mama", dept: "camera", details: "Frame over Kevin's shoulder so the phone content is readable while his shoulder establishes point of view. Lock phone brightness and screen orientation; record a clean phone-screen insert separately in case screen flicker or moiré needs replacement." },
          { text: '1.2 MCU Kevin: "Haloo paa-maa"', dept: "camera", details: "Hold a matching medium close-up at Kevin's phone eyeline. Capture the greeting, listening pause and any natural reaction; leave handles before and after the line for the edit." },
          { text: "1.3 Parents' footage at the warm home set (Papa, Mama, tree, lights)", dept: "direction", details: "Record the parents' playback footage as its own setup. Cover Papa and Mama with the tree and warm lights visible, then get a clean frame suitable for the phone screen; confirm screen orientation and eyelines with the Scene 1 insert." },
          { text: '1.4 MCU Kevin: the fake smile ("Seru dong Maah...")', dept: "camera", details: "Match the 1.2 framing and phone eyeline. Hold through the deliberately upbeat delivery and smile so the following emotional change has a clear starting point." },
          { text: '1.5 Slow push-in: the drop, smile fades, "Huftttt..."', dept: "camera", details: "Begin from the established framing and make one slow, even push toward Kevin. Keep the drop visible, let the smile fall before the sigh, and maintain focus on his face through the move." },
          { text: "1.6 Optional: reverse through the wet glass from the balcony", dept: "camera", details: "Optional exterior reverse: frame Kevin through the rain-speckled glass, using droplets as foreground texture without obscuring his expression. Check reflections, focus through the glass and continuity of his screen eyeline." },
          { text: "Phone-screen flicker tested, or screen replacement planned", dept: "camera", details: "Test the actual phone brightness and playback on camera at the chosen frame rate and shutter. If bands, moiré or clipped screen detail remain, plan a tracked replacement rather than changing the locked camera exposure." },
          { text: "Room tone recorded at the window", dept: "sound", details: "Record at least 60 seconds of quiet room ambience with the set and nearby crew still; label the location and take, and capture a separate exterior ambience if it will be used." }
        ]
      },
      {
        key: "s2",
        tag: "Scene 2",
        title: "Kamar Kevin, sore",
        dept: "camera",
        prep: "Messy desk, neon sticky notes visible and lit, PPTI books, hallway light ready for the door rim",
        items: [
          { text: "2.1 Gimbal tracking: Kevin walks in", dept: "camera", details: "Track Kevin from the doorway into the room and let him reach the bed in one continuous move. Rehearse the path, pace and stopping mark; keep the desk and sticky-note geography consistent for the later wide and insert." },
          { text: "2.2 Wide, high angle: Kevin alone on the bed", dept: "camera", details: "Establish the room from above with Kevin isolated on the bed and enough surrounding space to show the dorm environment. Hold the composition through his stillness before the others arrive." },
          { text: "2.3 Pan and track: Glorion and Malvin enter, hard hallway rim light", dept: "camera", details: "Start on Kevin or the doorway as staged, then pan and track the entrance, ending with all three characters' positions clear. Preserve the doorway as the source direction for the rim; rehearse the move and avoid losing the entering actors during the pan." },
          { text: '2.4 MCU Kevin and reverse MCU Glorion: "Aman taah, Kev?" / "Aman ajaa lohh"', dept: "camera", details: "Record Kevin's line and reaction, then a matching reverse on Glorion. Keep eyelines on the same conversational axis and capture clean starts, finishes and a brief listening beat for each side." },
          { text: "2.5 Insert with rack focus onto the neon sticky notes (rack practiced)", dept: "camera", details: "Begin with the intended foreground or desk detail soft, then pull focus cleanly onto the neon notes. Keep the notes readable and still; rehearse the focus marks and record a steady hold after the rack." },
          { text: "2.6 Two-shot: Malvin and Glorion trade a glance, lakban request", dept: "camera", details: "Keep both characters in the frame for the glance and request. Hold long enough to read the shared look and response; maintain prop and body-position continuity with the prior entrance coverage." },
          { text: "2.7 Wide, high angle: door closes, light fades to shadow", dept: "camera", details: "Return to the established high wide. Keep Kevin and the closing door visible as the doorway light fades; rehearse the door timing and light cue together, then hold after the fade for an edit point." },
          { text: "Foley recorded: totebags, cables, door, bed creak", dept: "sound", details: "Record isolated takes for each prop and surface at the scene positions. Capture several clean variations, avoid dialogue overlap, and label each sound with the action and take." },
          { text: "Room tone recorded", dept: "sound", details: "Record at least 60 seconds of quiet room ambience after the scene is dressed; keep the room, practicals and doors in their scene state." }
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
          { text: "3.1 MCU Kevin at the desk: the complaint", dept: "camera", details: "Frame Kevin at the desk for the complaint and let the performance land before the next cue. Keep the balcony direction established in his eyeline and record a clean pause at the end." },
          { text: "3.2 Whip pan to the balcony door, thunder flash, lamp flicker", dept: "camera", details: "Start on Kevin, then whip to the balcony door on the agreed sound/light cue. Rehearse the pan endpoint and cue timing without strobe first; record a clean hold on the door after the move." },
          { text: "3.3 Static wide: glass door covered in smoke, red-gold light", dept: "camera", details: "Lock a wide that includes the door and enough room foreground for the later reveal. Build the smoke in controlled passes and maintain a clear path for the performer and crew." },
          { text: "3.4 ECU Kevin's eyes", dept: "camera", details: "Get a tight eye reaction with Kevin looking toward the door. Hold before and after the expression change; check focus and avoid flashing effects during rehearsal." },
          { text: "3.5 Kevin approaches the door", dept: "camera", details: "Cover Kevin's approach from his mark to the door with the move and stopping point rehearsed. Preserve the same screen direction and pace as the following handle insert." },
          { text: "3.6 ECU insert: hand on the handle", dept: "camera", details: "Isolate the hand reaching for and settling on the handle. Match hand, sleeve and handle position to the wide; do not actually force or slam the door during the insert." },
          { text: "3.7 KABOOM: low-angle wide, strobe, fog, door bursts open (fog-only rehearsal first)", dept: "camera", details: "Shoot the low wide with the doorway, Kevin and balcony reveal area in frame. Rehearse the action with fog only, then add the approved flash cue at no more than 3 flashes per second; choreograph the door safely and keep the path clear." },
          { text: "3.8 Reveal: Jansen on the balcony floor", dept: "camera", details: "Hold the reveal composition after the door opens so Jansen's position reads clearly. Preserve the agreed floor mark and costume continuity; capture a clean reaction hold before dialogue coverage." },
          { text: '3.9 MCU Jansen at floor level: "Aduh... encok gue..."', dept: "camera", details: "Frame at Jansen's floor level and keep his face readable against the balcony background. Record the line, recovery movement and a short pause while preserving the agreed position on the floor." },
          { text: '3.10 MS Kevin with the broom: "WOIIII! KAU SIAPA?!"', dept: "camera", details: "Frame Kevin with the broom clearly visible and aimed safely away from cast. Capture the shout and reaction without swinging toward another performer; match the established doorway eyeline." },
          { text: "3.11 Two-shot standoff: Jansen dusts off his coat", dept: "camera", details: "Keep both characters and the broom relationship legible in one frame. Let Jansen's dust-off and Kevin's response play without cutting away, then hold for an edit point." },
          { text: "3.12 MCU Jansen: the solution, backlit, 4:1 contrast", dept: "camera", details: "Cover Jansen's solution in a matching medium close-up with a clear background edge. The 4:1 ratio is a visual reference only; meter or monitor the actual exposure and retain detail in the face." },
          { text: '3.13 MCU Kevin: "kok tau?!" / "video apaan?"', dept: "camera", details: "Record Kevin's two reactions in the same angle and eyeline. Leave a small beat between the questions and capture Jansen's off-camera listening direction for a clean reverse edit." },
          { text: "3.14 ECU insert: the DVD handoff", dept: "art", details: "Get a tight insert of the DVD moving from Jansen to Kevin, with the label and hands visible as needed. Match which hand holds it and the direction of transfer to the wider coverage." },
          { text: "3.15 MS / OTS: Kevin sets up laptop and projector", dept: "camera", details: "Cover Kevin placing and operating the laptop/projector from a medium angle, then an over-shoulder view that establishes the screen direction. Record the device actions cleanly and maintain prop positions for Scene 4." },
          { text: "3.16 ECU: projector beam into the lens, Pro-Mist bloom", dept: "camera", details: "Treat this as a separate insert from the balcony strobe. Aim the projector or focused beam past Kevin's profile toward the lens; check glare and highlight detail, then hold the beam for an edit point." },
          { text: "3.17 Static wall shot, the lead-in to the musical", dept: "camera", details: "Record a locked, clean view of the projection wall as the transition plate. Keep the frame clear of crew and stray reflections; capture enough pre-roll and post-roll for the edit." },
          { text: "Wild lines recorded for dialogue hit by fog or wind", dept: "sound", details: "Record the affected dialogue in a quiet, controlled position after the action, matching the actors' delivery and distance. Label each line and record room tone separately." },
          { text: "Room ventilated, floors checked for slips", dept: "safety", details: "Ventilate between fog takes, keep the escape route clear, and dry any wet or slippery floor before cast or crew move through the area." }
        ]
      },
      {
        key: "s4",
        tag: "Scene 4",
        title: "Kamar Kevin, malam",
        dept: "camera",
        prep: "Projector dimmer cue ready, smoke cleared, clean plate of the empty room planned",
        items: [
          { text: '4.1 CU Kevin: the awe, projector dims, "WUOHHHH..."', dept: "camera", details: "Frame Kevin's close-up for the playback reaction. Start at the agreed brighter level, then execute the four-second fade with his expression; hold through the final low level and keep the eye-line on the projection." },
          { text: '4.2 Two-shot and MCU Jansen: "Gimana, seru gaa?" and the silent smile', dept: "camera", details: "Cover the shared exchange in a two-shot, then get Jansen's matching medium close-up for the question and silent smile. Keep eyelines and screen direction consistent; allow the smile to land before moving on." },
          { text: "4.3 Door knock and Glorion's line", dept: "camera", details: "Record the knock as a distinct cue, then cover the doorway/reaction and Glorion's line. Keep the door position and Kevin/Jansen eyelines consistent with the room master." },
          { text: "4.4 Pan and rack focus: Jansen disappears (clean plate recorded)", dept: "camera", details: "Pan and rack focus on the rehearsed cue as Jansen disappears. Record a locked clean plate from the exact camera position with matching focus and lighting, plus a still frame/reference for the VFX or dissolve." },
          { text: "Whoosh or wind-chime reference noted for post", dept: "sound", details: "Capture a short on-set timing reference for the disappearance cue and note the frame/action it should sync to; record the final effect separately in post." },
          { text: "Room tone recorded", dept: "sound", details: "Record at least 60 seconds of quiet room ambience after the smoke is cleared and the set is settled." }
        ]
      },
      {
        key: "s5",
        tag: "Scene 5",
        title: "Common room (CWS), malam",
        dept: "art",
        prep: "Room fully dressed, fairy lights on, sticky-note tree on the window, backlight outside the window, hot cocoa and snacks ready",
        items: [
          { text: "5.1 Gimbal push-in and pedestal up: the reveal", dept: "camera", details: "Begin on the agreed wider reveal frame, then push in and raise the camera smoothly to expose the room and group. Rehearse the path around set dressing, finish on the intended composition, and hold briefly before cutting." },
          { text: "5.2 Frontal MCU Kevin: teary, fairy-light catchlights", dept: "camera", details: "Frame Kevin frontally in a medium close-up with the warm practicals behind him. Hold on his emotional reaction without forcing tears; check catchlights and background focus in the monitor." },
          { text: "5.3 Wide and tilt: the sticky-note tree, backlit neon", dept: "camera", details: "Establish the tree and its place in the common room, then tilt to reveal its full height. Keep the window/tree relationship in frame and avoid clipping the backlit paper." },
          { text: '5.4 OTS and ECU: Kevin writes "NOT JUST STORY" on the star', dept: "art", details: "Capture an over-shoulder view that shows the writing action, then a tight insert where the words are readable. Match marker, hand, star orientation and lettering across takes." },
          { text: "5.5 Tilt up: the star goes on top, backlit cyan", dept: "camera", details: "Start on the upper part of the tree and tilt with the star as it is placed. End with the star clearly framed against the window; keep the placement hand and direction continuous with the insert." },
          { text: "5.6 Wide 3-shot at 60p: the toast", dept: "camera", details: "Frame all three actors with mugs and faces visible for the toast. Record at the planned 60p preset and its matching shutter, rehearse the shared raise/timing, and capture a clean hold after the action." },
          { text: '5.7 Dolly out: Jansen steps in, "Sederhana, kan? Tapi hangat."', dept: "camera", details: "Start on the group, dolly back as Jansen enters, and keep the cast's reactions in the widening composition. Rehearse the entry mark and dolly path; record the line and a reaction hold." },
          { text: "5.8 B-roll A at 60p: laughing, marshmallows, bokeh (shoot plenty)", dept: "camera", details: "Collect several short slow-motion moments of natural laughter and marshmallows, with the fairy lights rendered as background bokeh. Vary the moments and framings while preserving the same scene continuity and 60p preset." },
          { text: "5.9 B-roll B: hand on the mug, glide up to Kevin's smile", dept: "camera", details: "Begin tightly on Kevin's hand and mug, then glide up to reveal his smile in one controlled move. Rehearse the move and focus path; capture a still start and end for edit coverage." },
          { text: "5.10 MCU Jansen: the closing smile", dept: "camera", details: "Record Jansen's closing medium close-up with a clean eye-line and background. Let the final smile settle, hold a few seconds, and capture a neutral reset for edit options." },
          { text: "5.11 Dolly back through the window (match-cut plan confirmed)", dept: "camera", details: "Rehearse the reverse move through the window and agree on the match point with the exterior/drone setup. Keep window reflections controlled and record a matching start/end reference for framing and movement." },
          { text: "Jansen's V.O. recorded cleanly in a quiet room", dept: "sound", details: "Record the narration in a quiet, acoustically controlled space with consistent mic distance. Capture several complete takes and room tone; label the preferred delivery without processing the original." },
          { text: "Foley recorded: mug clinks, paper peel and press, marker squeak", dept: "sound", details: "Record mug, paper and marker sounds separately with clean starts and tails. Match the on-screen actions and surfaces, capture variations, and avoid handling noise between takes." },
          { text: "Room tone recorded", dept: "sound", details: "Record at least 60 seconds of quiet common-room ambience with the set dressed and practicals in their scene state." }
        ]
      },
      {
        key: "sx",
        tag: "Exterior",
        title: "Drone and title cards",
        dept: "camera",
        prep: "Dry night, low wind, CWS window lit, pilot and spotter ready, permission confirmed",
        items: [
          { text: "5.12 Drone pull-back from the glowing window (or fake-drone fallback on a boom pole)", dept: "camera", details: "With flight permission and a spotter, begin close to the lit window and pull back smoothly to reveal the building. Keep the aircraft away from people and structures; use the rehearsed boom-pole fallback if flight is unsafe or not permitted." },
          { text: "Extra drone passes at 2-3 heights", dept: "camera", details: "Record separate, steady passes at two or three pre-agreed safe heights. Keep the same direction and endpoint where possible so the editor can compare and choose a continuous move." },
          { text: "Clean plate without rain for the VFX rain overlay", dept: "camera", details: "Lock the camera and record the same exterior framing with the rain effect absent. Keep the window lighting and all set elements unchanged; avoid moving objects or people during the plate." },
          { text: "5.13 Closing Bible verse text ready for the edit", dept: "direction", details: "Confirm the approved verse wording, spelling, translation and attribution with production before picture lock. Supply the final text as a separate clean graphic reference." },
          { text: '5.14 Title card "NOT JUST STORY"', dept: "direction", details: "Capture or prepare the final title card with approved spelling and matching visual style. Provide a clean version without unintended reflections or overlays for the edit." }
        ]
      }
    ]
  },
  {
    id: "lighting",
    label: "Lighting & Grip",
    icon: "zap",
    lightingPlanFor: "scenes",
    sections: [
      {
        key: "confirm",
        title: "Scene lighting confirmations",
        dept: "lighting",
        items: [
          { text: "Scene 1: phone key, window backlight, wet glass and negative fill checked on camera", dept: "lighting" },
          { text: "Scene 2: desk practical, ceiling bounce, sticky-note insert and doorway rim checked", dept: "lighting" },
          { text: "Scene 3: balcony strobe/fog safety and separate projector-beam insert checked", dept: "lighting" },
          { text: "Scene 4: projector-wall bounce and four-second dimmer cue rehearsed", dept: "lighting" },
          { text: "Scene 5: book light, fairy-light background and tree backlight checked", dept: "lighting" }
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
