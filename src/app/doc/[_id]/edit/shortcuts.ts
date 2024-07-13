import {
  MatchDecorator,
  Decoration,
  ViewPlugin,
  RangeSet,
} from "@uiw/react-codemirror";
import { SourceMapGenerator } from "source-map";

function posToLineCol(str: string, pos: number) {
  const lines = str.slice(0, pos).split("\n");
  return { line: lines.length, column: lines[lines.length - 1].length };
}

const shortcuts = [
  {
    regexp: /^\b([^: ]+):/gm,
    transform(input: string, generator: SourceMapGenerator) {
      return input.replaceAll(this.regexp, (_match, role, offset) => {
        const { line, column } = posToLineCol(input, offset);
        // 0 2 4 6 8 10 13 16 19
        // Hiero: hi there
        //    \......,\......,
        // say(role="hiero") hi there
        const pre = 'say(role="';
        const post = '")';
        const replacement = pre + lowerCaseFirstLetter(role) + post;

        generator.addMapping({
          source: ".",
          original: { line, column },
          generated: { line, column: column + pre.length },
        });
        generator.addMapping({
          source: ".",
          original: { line, column: role.length + 1 /* ":" */ },
          generated: { line, column: column + replacement.length + 1 },
        });

        return replacement;
      });
    },
  },
  {
    regexp: /^(?<skip>\* ?)(?<role>[^ ]*)/gm,
    transform(input: string, generator: SourceMapGenerator) {
      return input.replaceAll(this.regexp, (_match, skip, role, offset) => {
        const { line, column } = posToLineCol(input, offset);
        // 0 2 4 6 8 10 13 16 19
        // * Hiero does something.
        //   \......,\.......
        // do(role="hiero") does something
        const pre = 'do(role="';
        const post = '")';
        const replacement = pre + lowerCaseFirstLetter(role) + post;

        generator.addMapping({
          source: ".",
          original: { line, column: column + skip.length },
          generated: { line, column: column + pre.length },
        });
        if (role.length)
          generator.addMapping({
            source: ".",
            original: { line, column: skip.length + role.length },
            generated: { line, column: column + replacement.length },
          });

        return replacement;
      });
    },
  },
];

function lowerCaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export function transformAndMapShortcuts(input: string) {
  let transformed = input;
  const generator = new SourceMapGenerator();

  for (const shortcut of shortcuts)
    transformed = shortcut.transform(transformed, generator);

  return {
    transformed,
    sourceMap: generator.toString(),
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
      const { groups } = match;
      if (!groups) return;
      add(
        from + groups.skip.length,
        Math.min(to, from + groups.role.length + 2),
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
