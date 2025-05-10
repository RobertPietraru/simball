import json;
entries = [];
with open("text.md", "r", encoding="utf-8") as f:
    label = ""
    description = ""
    for line in f:
        # if line is empty, save the current label and description
        if line.strip() == "":
            if len(label) > 1:
                entries.append({
                    "label": label,
                    "description": description
                })
            label = ""
            description = ""
            continue

        # if label is not set, set it
        if label == "":
            label = line.strip()
            continue

        # if label is set, add the description
        description += line





with open("output.json", "w", encoding="utf-8") as f:
    json.dump(entries, f, ensure_ascii=False);