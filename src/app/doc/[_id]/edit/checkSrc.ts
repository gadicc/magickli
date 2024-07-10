import pugInlineTags from "pug-parser/lib/inline-tags";
import { roles } from "../DocRender";

interface PugAttribute {
  column: number;
  line: number;
  mustEscape: boolean;
  name: string;
  val: string;
}

interface PugBlock {
  type: "Block";
  line: number;
  nodes: PugTag[];
}
interface PugTag {
  type: "Tag";
  attributeBlocks?: [];
  attrs: PugAttribute[];
  block: PugBlock;
  column?: number;
  isInline: boolean;
  line: number;
  name: string;
  selfClosing: boolean;
}

function nodeWalker(
  node: PugBlock | PugTag,
  cb: (node: PugBlock | PugTag) => void
) {
  cb(node);
  if (node.type === "Block") {
    node.nodes.forEach((child) => nodeWalker(child, cb));
  }
}

const allowedTags = ["declareVar", "title", "do", "say", "todo", "note"].concat(
  pugInlineTags
);

interface CheckSrcError {
  from: { line: number; column: number };
  to: { line: number; column: number };
  message: string;
  severity: "error" | "warning";
}

export function checkSrc(node: PugBlock | PugTag) {
  const errors: CheckSrcError[] = [];
  nodeWalker(node, (node) => {
    if (node.type === "Tag") {
      if (!allowedTags.includes(node.name)) {
        errors.push({
          from: { line: node.line, column: node.column || 0 },
          to: {
            line: node.line,
            column: (node.column || 0) + node.name.length,
          },
          message: "Unrecognized tag: " + node.name,
          severity: "warning" as const,
        });
      } else if (
        node.name === "do" ||
        node.name === "say" ||
        node.name == "task"
      ) {
        const roleAttr = node.attrs.find((a) => a.name === "role");
        if (!roleAttr) return;

        const role = roleAttr?.val.replace(/^["']|["']$/g, "");
        let valid = false;
        if (role) {
          if (roles[role]) valid = true;
          else if (["all", "all-officers"].includes(role)) valid = true;
          else {
            const match = role.match(
              /^(?<prefix>all-(officers-)?except-)?(?<roles>.+)$/
            );
            if (match && match.groups) {
              const prefix = match.groups.prefix || "";
              const exceptRoles = match.groups.roles.split(",");
              if (exceptRoles) {
                let start = prefix.length + 1;
                for (const role of exceptRoles) {
                  if (!roles[role]) {
                    errors.push({
                      from: {
                        line: roleAttr.line,
                        column:
                          (roleAttr.column || 0) +
                          roleAttr.name.length +
                          1 +
                          start,
                      },
                      to: {
                        line: roleAttr.line,
                        column:
                          (roleAttr.column || 0) +
                          roleAttr.name.length +
                          1 +
                          start +
                          role.length,
                      },
                      message: "Unrecognized role: " + role,
                      severity: "warning" as const,
                    });
                  }
                  start += role.length + 1;
                }
                return;
              }
            }
          }
        }

        if (!valid) {
          errors.push({
            from: {
              line: roleAttr.line,
              column: (roleAttr.column || 0) + roleAttr.name.length + 1,
            },
            to: {
              line: roleAttr.line,
              column:
                (roleAttr.column || 0) +
                roleAttr.name.length +
                1 +
                roleAttr.val.length,
            },
            message: "Unrecognized role: " + role,
            severity: "warning" as const,
          });
        }
      }
    }
  });
  return errors;
}
