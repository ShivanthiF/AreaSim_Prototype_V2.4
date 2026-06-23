import re

# 1. Update CountingStepper.tsx
stepper_file = "/Users/shivanthif/Projects/AreaSim/AreaSim_Prototype_V2.4_(Counting_Tool_Guidence)/src/components/ui/CountingStepper.tsx"
with open(stepper_file, "r") as f:
    content = f.read()

content = re.sub(
    r'    case "active-session":\n      return `/project/\$\{projectId\}/session-overview`;',
    r'    case "active-session":\n      return `/project/${projectId}/floor/${floorId}/count#active-session`;',
    content
)

with open(stepper_file, "w") as f:
    f.write(content)


# 2. Update page.tsx
page_file = "/Users/shivanthif/Projects/AreaSim/AreaSim_Prototype_V2.4_(Counting_Tool_Guidence)/src/app/project/[id]/floor/[floorId]/count/page.tsx"
with open(page_file, "r") as f:
    page_content = f.read()

# Remove state
page_content = re.sub(r'  const \[startModalDismissed, setStartModalDismissed\] = useState\(true\);\n', '', page_content)

# Remove ref
page_content = re.sub(r'  const startPromptTimeoutRef = useRef<NodeJS\.Timeout | null>\(null\);\n', '', page_content)

# Update useEffect for #session-details to remove setStartModalDismissed
page_content = re.sub(
    r'      setStartModalDismissed\(true\);\n',
    '',
    page_content
)

# Remove useEffect for clearing timeout
page_content = re.sub(
    r'  // Clear the delayed start-session prompt timeout on unmount\n  useEffect\(\(\) => \(\) => \{ if \(startPromptTimeoutRef\.current\) clearTimeout\(startPromptTimeoutRef\.current\); \}, \[\]\);\n\n',
    '',
    page_content
)

# Remove setTimeout from handleSetupConfirm
page_content = re.sub(
    r'      if \(startPromptTimeoutRef\.current\) clearTimeout\(startPromptTimeoutRef\.current\);\n      startPromptTimeoutRef\.current = setTimeout\(\(\) => setStartModalDismissed\(false\), 3000\);\n',
    '',
    page_content
)

# Update handleStepClick
page_content = re.sub(
    r'    if \(id === "session-details"\) \{ setCountingPhase\("ready"\); return; \}',
    r'    if (id === "session-details") { setCountingPhase("ready"); return; }\n    if (id === "active-session") { setCountingPhase("session"); return; }',
    page_content
)

# Add #active-session useEffect
active_session_effect = r'''  // Navigate to session-details phase when arriving from history page
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#session-details") {
      setCountingPhase("ready");
      window.history.replaceState(null, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate to session phase when arriving from hash
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#active-session") {
      setCountingPhase("session");
      window.history.replaceState(null, "", window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);'''

page_content = re.sub(
    r'  // Navigate to session-details phase when arriving from history page\n  useEffect\(\(\) => \{\n    if \(typeof window !== "undefined" && window\.location\.hash === "#session-details"\) \{\n      setCountingPhase\("ready"\);\n      window\.history\.replaceState\(null, "", window\.location\.pathname\);\n    \}\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  \}, \[\]\);',
    active_session_effect,
    page_content
)

# Remove Start Session Modal
modal_pattern = r'        \{\/\* ── Start Session Modal ── \*\/\}[\s\S]*?<\/AnimatePresence>\n\n'
page_content = re.sub(modal_pattern, '', page_content)

with open(page_file, "w") as f:
    f.write(page_content)

print("Updates applied.")
