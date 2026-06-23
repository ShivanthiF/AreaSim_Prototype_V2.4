import re

file_path = "/Users/shivanthif/Projects/AreaSim/AreaSim_Prototype_V2.4_(Counting_Tool_Guidence)/src/app/project/[id]/floor/[floorId]/count/page.tsx"

with open(file_path, "r") as f:
    content = f.read()

# 1. Remove useState
content = re.sub(r'  const \[showInstructionsModal, setShowInstructionsModal\] = useState\(false\);\n', '', content)

# 2. Remove useEffect
use_effect_pattern = r'  // Show instructions modal only when arriving via #show-instructions hash\n  useEffect\(\(\) => \{\n    if \(typeof window !== "undefined" && window\.location\.hash === "#show-instructions"\) \{\n      setShowInstructionsModal\(true\);\n      window\.history\.replaceState\(null, "", window\.location\.pathname\);\n    \}\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  \}, \[\]\);\n'
content = re.sub(use_effect_pattern, '', content)

# 3. Modify handleVerifyMainCheck
old_func = r'''  const handleVerifyMainCheck = \(\) => \{
    if \(allVerified\) setVerifiedRooms\(new Set\(\)\);
    else setConfirmBulk\("verify"\);
  \};'''

new_func = '''  const handleVerifyMainCheck = () => {
    if (allVerified) {
      setVerifiedRooms(new Set());
    } else {
      const allHaveCategory = rooms.length > 0 && rooms.every((r) => roomCategories[r.id]);
      if (!allHaveCategory) {
        setShowCategoryRequiredModal(true);
      } else {
        setConfirmBulk("verify");
      }
    }
  };'''

content = re.sub(old_func, new_func, content)

# 4. Remove Instructions Modal
modal_pattern = r'        \{\/\* ── Instructions Modal ─────────────────────────────────────────────────── \*\/\}[\s\S]*?<\/AnimatePresence>\n\n'
content = re.sub(modal_pattern, '', content)

with open(file_path, "w") as f:
    f.write(content)

print("File updated successfully.")
