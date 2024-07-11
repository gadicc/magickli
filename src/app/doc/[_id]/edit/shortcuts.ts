import {
  MatchDecorator,
  Decoration,
  ViewPlugin,
  RangeSet,
} from "@uiw/react-codemirror";

const shortcuts = [
  {
    regexp: /^([A-Za-z,-]+):/,
  },
  {
    regexp: /^(?<skip>\* ?)(?<role>[A-Za-z,-]*)(?<rest>.*)$/,
  },
];

export function transformAndMapShortcuts(input: string) {
  const mappings: Record<number, [number, number, number][]> = {};
  const lines = input.split("\n");
  for (let line = 0; line < lines.length; line++) {
    const lineStr = lines[line];
    let match;
    if ((match = lineStr.match(shortcuts[0].regexp))) {
      const lineMappings = mappings[line + 1] || (mappings[line + 1] = []);
      const pre = 'say(role="';
      const post = '")';
      const shortenedBy = 1; // matches that aren't kept, i.e. ":"
      const replacement = pre + match[1].toLowerCase() + post;
      const offset = replacement.length - match[0].length;

      // console.log(lines[line]);
      lines[line] = replacement + lineStr.slice(match[0].length);
      // console.log(lines[line]);
      lineMappings.push([0, match[0].length - 1, offset - shortenedBy]);
      lineMappings.push([
        match[0].length + 1, // include the ":"
        lineStr.length,
        offset - shortenedBy,
      ]);
    } else if ((match = lineStr.match(shortcuts[1].regexp))) {
      // console.log(match);
      const lineMappings = mappings[line + 1] || (mappings[line + 1] = []);
      const { skip, role, rest } = match.groups;

      if (!role) {
        lines[line] = "";
        continue;
      }

      const pre = 'do(role="';
      const post = '")';
      const replacement = pre + role.toLowerCase() + post;
      // console.log(lines[line]);
      lines[line] = replacement + rest;
      // console.log(lines[line]);
      lineMappings.push([
        skip.length,
        skip.length + role.length,
        pre.length - skip.length,
      ]);
      lineMappings.push([
        skip.length + role.length,
        lineStr.length,
        pre.length - skip.length,
      ]);
    }
  }

  const transformed = lines.join("\n");
  return {
    transformed,
    mappings,
  };
}
const roleSpec = { attributes: { style: "color: #aaf" } };
const restSpec = { attributes: { style: "color: #98c379" } }; // theme string color
const nonSpec = { attributes: { style: "color: rgb(171, 178, 191)" } };

const shortcutDecorators = [
  new MatchDecorator({
    regexp: new RegExp(shortcuts[0].regexp, "g"),
    decorate(add, from, to, match, view) {
      add(from, from + match[1].length, Decoration.mark(roleSpec));
      add(
        from + match[1].length,
        from + match[1].length + 1,
        Decoration.mark(nonSpec)
      );
      add(
        from + match[1].length + 1,
        from + match.input.length,
        Decoration.mark(restSpec)
      );
    },
  }),
  new MatchDecorator({
    regexp: new RegExp(shortcuts[1].regexp, "g"),
    decorate(add, from, to, match, view) {
      add(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from + match.groups!.skip.length,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from + match.groups!.role.length + 2,
        Decoration.mark(roleSpec)
      );
    },
  }),
  new MatchDecorator({
    regexp: /role="([A-Za-z,-]+)"/g,
    decorate(add, from, to, match, view) {
      add(from + 6, to - 1, Decoration.mark(roleSpec));
    },
  }),
];

export const shortcutHighlighters = shortcutDecorators.map((decorator) =>
  ViewPlugin.fromClass(
    class {
      decorations: RangeSet<Decoration>;

      constructor(view) {
        this.decorations = decorator.createDeco(view);
      }
      update(update) {
        this.decorations = decorator.updateDeco(update, this.decorations);
      }
    },
    { decorations: (v) => v.decorations }
  )
);
