"""Validate the documentation and the supported JSON Schema fixture contracts."""
from pathlib import Path
from urllib.parse import unquote
from datetime import datetime
import json
import re
import xml.etree.ElementTree as ET
import os

ROOT = Path(__file__).resolve().parents[1]
errors = []
IGNORED_DIRS = {".git", "node_modules", ".venv", ".obsidian", "artifacts", "__pycache__"}

def project_files(extension):
    result = []
    for directory, dirs, names in os.walk(ROOT):
        dirs[:] = [name for name in dirs if name not in IGNORED_DIRS]
        result.extend(Path(directory) / name for name in names if name.endswith(extension))
    return result

def require(condition, message):
    if not condition:
        errors.append(message)

def load(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))

schema = load("examples/contracts/schemas.json")

def validate(value, rule, path="$"):
    if "$ref" in rule:
        return validate(value, schema["$defs"][rule["$ref"].split("/")[-1]], path)
    if "anyOf" in rule:
        for variant in rule["anyOf"]:
            checkpoint = len(errors)
            validate(value, variant, path)
            if len(errors) == checkpoint:
                return
            del errors[checkpoint:]
        errors.append(path + ": no anyOf variant matched")
        return
    if "const" in rule:
        require(value == rule["const"], path + ": const mismatch")
    if "enum" in rule:
        require(value in rule["enum"], path + ": enum mismatch")
    types = rule.get("type")
    if types:
        types = types if isinstance(types, list) else [types]
        checks = {
            "object": lambda: isinstance(value, dict),
            "array": lambda: isinstance(value, list),
            "string": lambda: isinstance(value, str),
            "boolean": lambda: isinstance(value, bool),
            "integer": lambda: isinstance(value, int) and not isinstance(value, bool),
            "number": lambda: isinstance(value, (int, float)) and not isinstance(value, bool),
            "null": lambda: value is None,
        }
        if not any(checks[k]() for k in types):
            errors.append(path + ": invalid type")
            return
    if isinstance(value, dict):
        for key in rule.get("required", []):
            require(key in value, path + ": missing " + key)
        properties = rule.get("properties", {})
        if rule.get("additionalProperties") is False:
            require(not (set(value) - set(properties)), path + ": unexpected properties")
        for key, item in value.items():
            if key in properties:
                validate(item, properties[key], path + "." + key)
    if isinstance(value, list):
        if rule.get("uniqueItems"):
            require(len({json.dumps(v, sort_keys=True) for v in value}) == len(value), path + ": duplicate item")
        for index, item in enumerate(value):
            if "items" in rule:
                validate(item, rule["items"], f"{path}[{index}]")
    if isinstance(value, str):
        require(len(value) >= rule.get("minLength", 0), path + ": too short")
        if rule.get("format") == "date-time":
            try:
                datetime.fromisoformat(value.replace("Z", "+00:00"))
                require(value.endswith("Z") or bool(re.search(r"[+-]\d\d:\d\d$", value)), path + ": timezone missing")
            except ValueError:
                errors.append(path + ": invalid datetime")
    if isinstance(value, (int, float)) and not isinstance(value, bool) and "minimum" in rule:
        require(value >= rule["minimum"], path + ": below minimum")

json_files = project_files(".json")
for file in json_files:
    try:
        json.loads(file.read_text(encoding="utf-8"))
    except (ValueError, UnicodeError) as error:
        errors.append(str(file.relative_to(ROOT)) + ": " + str(error))

markdown = project_files(".md")
for file in markdown:
    text = file.read_text(encoding="utf-8")
    targets = re.findall(r"\[[^\]]*\]\(([^)]+)\)", text) + re.findall(r'<img[^>]+src="([^"]+)"', text)
    for target in targets:
        target = target.strip("<>").split("#", 1)[0]
        if not target or re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", target):
            continue
        require((file.parent / unquote(target)).exists(), f"{file.relative_to(ROOT)}: broken link {target}")

scenario = load("examples/contracts/scenario.json")
svg_files = list((ROOT / "docs/assets").rglob("*.svg"))
for svg in svg_files:
    try:
        raw = svg.read_text(encoding="utf-8")
        require("<!DOCTYPE" not in raw, str(svg.relative_to(ROOT)) + ": DOCTYPE forbidden")
        tree = ET.fromstring(raw)
        require(tree.tag == "{http://www.w3.org/2000/svg}svg", str(svg.relative_to(ROOT)) + ": invalid SVG root")
        for node in tree.iter():
            require(node.tag.split("}")[-1] not in ("script", "foreignObject"), str(svg.relative_to(ROOT)) + ": unsafe SVG node")
            for attr, value in node.attrib.items():
                require(not attr.lower().startswith("on"), str(svg.relative_to(ROOT)) + ": SVG event handler")
                if attr.split("}")[-1] == "href":
                    require(value.startswith("#"), str(svg.relative_to(ROOT)) + ": external SVG resource")
    except (ET.ParseError, UnicodeError) as error:
        errors.append(str(svg.relative_to(ROOT)) + ": " + str(error))
validate(scenario, schema)
agents = {a["id"] for a in scenario["agents"]}
require(scenario["run"]["agent_id"] in agents, "run agent missing")
require(scenario["incident"]["run_id"] == scenario["run"]["id"], "incident run mismatch")
require(scenario["patch"]["incident_id"] == scenario["incident"]["id"], "patch incident mismatch")
require(scenario["patch"]["baseline_agent_id"] in agents, "baseline missing")
require(scenario["patch"]["candidate_agent_id"] in agents, "candidate missing")
require(scenario["job"]["incident_id"] == scenario["incident"]["id"], "job incident mismatch")

responses = load("examples/contracts/api-responses.json")
for entity in responses["agents"]["items"]:
    validate(entity, schema["$defs"]["Agent"])
for entity in responses["incidents"]["items"]:
    validate(entity, schema["$defs"]["Incident"])
for key in ("pending_job", "failed_job"):
    validate(responses[key], schema["$defs"]["Job"])
validate(responses["provider_error"], schema["$defs"]["Error"])

def gate(evaluation):
    cases = evaluation["case_results"]
    target = next((c for c in cases if c["case_id"] == evaluation["target_case_id"]), None)
    if evaluation["status"] != "completed" or not cases:
        return "needs_human_review"
    target_improved = target and not target["before_passed"] and target["after_passed"]
    return "accepted" if (
        evaluation["before"]["total"] == evaluation["after"]["total"] > 0
        and evaluation["after"]["passed"] >= evaluation["before"]["passed"]
        and not evaluation["regressions"]
        and evaluation["security_passed"]
        and target_improved
    ) else "rejected"

for name in ("accepted", "rejected", "incomplete"):
    bundle = responses[name]
    for field, definition in (("patch", "Patch"), ("evaluation", "Evaluation"), ("report", "Report")):
        validate(bundle[field], schema["$defs"][definition], name + "." + field)
    evaluation, patch, report = bundle["evaluation"], bundle["patch"], bundle["report"]
    require(evaluation["patch_id"] == patch["id"], name + ": patch relation")
    require(report["patch_id"] == patch["id"] and report["evaluation_id"] == evaluation["id"], name + ": report relation")
    require(report["decision"] == patch["approval_status"] == gate(evaluation), name + ": unsafe/inconsistent decision")
    if evaluation["status"] == "completed":
        cases = evaluation["case_results"]
        ids = [c["case_id"] for c in cases]
        require(len(ids) == len(set(ids)), name + ": duplicate cases")
        for stage in ("before", "after"):
            require(evaluation[stage]["total"] == len(cases), name + ": total mismatch")
            require(evaluation[stage]["passed"] == sum(c[stage + "_passed"] for c in cases), name + ": score mismatch")
        regressions = [c["case_id"] for c in cases if c["before_passed"] and not c["after_passed"]]
        require(evaluation["regressions"] == regressions, name + ": regression mismatch")

dataset = load("datasets/sample/refunds.json")
require(len(dataset["cases"]) == len({c["id"] for c in dataset["cases"]}), "duplicate dataset case")
require(set(c["case_id"] for c in scenario["evaluation"]["case_results"]) <= {c["id"] for c in dataset["cases"]}, "fixture references absent dataset case")
for scenario_name in ("accepted", "rejected", "incomplete"):
    evaluation = responses[scenario_name]["evaluation"]
    require((evaluation["dataset_id"], evaluation["dataset_version"]) == (dataset["id"], dataset["version"]), scenario_name + ": dataset/version mismatch")

if errors:
    raise SystemExit("\n".join(errors))
print(f"OK: {len(markdown)} Markdown files, {len(json_files)} JSON files, fixture types/links/relations and 3 decision scenarios.")
print("Validates the JSON Schema subset used here; does not execute the product or call Grok.")
print(f"OK: {len(svg_files)} local SVG files and README image references.")
