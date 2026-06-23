import re

page_file = "/Users/shivanthif/Projects/AreaSim/AreaSim_Prototype_V2.4_(Counting_Tool_Guidence)/src/app/project/[id]/floor/[floorId]/count/page.tsx"
with open(page_file, "r") as f:
    content = f.read()

# 1. Update CountingPhase
content = content.replace(
    'type CountingPhase = "setup" | "ready" | "session";',
    'type CountingPhase = "setup" | "ready" | "session" | "counting";'
)

# 2. Remove activeSection
content = re.sub(
    r'  const \[activeSection, setActiveSection\] = useState<"left" \| "right">\("left"\);\n',
    '',
    content
)

# 3. Replace all activeSection logic
content = content.replace('setActiveSection("right")', 'setCountingPhase("counting")')
content = content.replace('setActiveSection("left")', 'setCountingPhase("session")')
content = content.replace('activeSection === "right"', 'countingPhase === "counting"')
content = content.replace('activeSection === "left"', 'countingPhase !== "counting"')

# 4. Add #room-counting handler
# Find #active-session handler to append
active_session_effect = r'''  // Navigate to session phase when arriving from hash
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#active-session") {
      setCountingPhase("session");
      window.history.replaceState(null, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);'''

room_counting_effect = active_session_effect + r'''

  // Navigate to counting phase when arriving from hash
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#room-counting") {
      setCountingPhase("counting");
      window.history.replaceState(null, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);'''

content = content.replace(active_session_effect, room_counting_effect)

# 5. Update handleStepClick
old_handle_click = r'''  const handleStepClick = (id: CountingStepId) => {
    if (id === "room-setup") { setEditRoomSettings(false); setCountingPhase("setup"); return; }
    if (id === "session-details") { setCountingPhase("ready"); return; }
    if (id === "active-session") { setCountingPhase("session"); return; }
    router.push(countingStepHref(projectId, floorId, id));
  };'''

new_handle_click = r'''  const handleStepClick = (id: CountingStepId) => {
    if (id === "room-setup") { setEditRoomSettings(false); setCountingPhase("setup"); return; }
    if (id === "session-details") { setCountingPhase("ready"); return; }
    if (id === "active-session") { setCountingPhase("session"); return; }
    if (id === "room-counting") { setCountingPhase("counting"); return; }
    router.push(countingStepHref(projectId, floorId, id));
  };'''

content = content.replace(old_handle_click, new_handle_click)

# 6. Update Stepper call in count/page.tsx
# activeStep={countingPhase === "session" ? "active-session" : "session-details"}
old_stepper = 'activeStep={countingPhase === "session" ? "active-session" : "session-details"}'
new_stepper = 'activeStep={countingPhase === "counting" ? "room-counting" : countingPhase === "session" ? "active-session" : "session-details"}'
content = content.replace(old_stepper, new_stepper)

with open(page_file, "w") as f:
    f.write(content)

stepper_file = "/Users/shivanthif/Projects/AreaSim/AreaSim_Prototype_V2.4_(Counting_Tool_Guidence)/src/components/ui/CountingStepper.tsx"
with open(stepper_file, "r") as f:
    stepper_content = f.read()

# Update CountingStepper route
stepper_content = stepper_content.replace(
    'return `/project/${projectId}/floor/${floorId}/history`;',
    'return `/project/${projectId}/floor/${floorId}/count#room-counting`;'
)

with open(stepper_file, "w") as f:
    f.write(stepper_content)

print("Updates successful.")
