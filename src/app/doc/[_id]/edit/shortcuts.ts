import {
  MatchDecorator,
  Decoration,
  ViewPlugin,
  RangeSet,
} from "@uiw/react-codemirror";
import SourceMapConsumer from "./SourceMapConsumer";
import remapping from "@ampproject/remapping";
import MagicString from "magic-string";

function posToLineCol(str: string, pos: number) {
  const lines = str.slice(0, pos).split("\n");
  return { line: lines.length, column: lines[lines.length - 1].length };
}

function lowerCaseFirstLetter(string) {
  return string
    .split(",")
    .map((s) => s.charAt(0).toLowerCase() + s.slice(1))
    .join(",");
}

const roleSpec = { attributes: { style: "color: #aaf" } };
const restSpec = { attributes: { style: "color: #98c379" } }; // theme string color
const nonSpec = { attributes: { style: "color: rgb(171, 178, 191)" } };

const shortcuts = [
  {
    name: "say",
    regexp: /^\b([\w,-]+):/gm,
    transform(input: string, s: MagicString, source: string) {
      const matches = input.matchAll(this.regexp);
      for (const match of matches) {
        const offset = match.index;
        const [_match, role] = match;
        // 0 2 4 6 8 10 13 16 19
        // Hiero: hi there
        //    \......,\......,
        // say(role="hiero") hi there
        const pre = 'say(role="';
        const post = '")';
        const replacement = pre + lowerCaseFirstLetter(role) + post;

        s.update(offset, offset + role.length, lowerCaseFirstLetter(role));
        s.remove(offset + role.length, offset + role.length + 1); // ":"
        s.appendRight(offset + role.length, post);
        s.prependLeft(offset, pre);
      }
      return s.toString();
    },
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
  },
  {
    name: "do",
    regexp: /^(?<skip>\* ?)(?<role>[\w,-]*)/gm,
    transform(input: string, s: MagicString, source: string) {
      const matches = input.matchAll(this.regexp);
      for (const match of matches) {
        const offset = match.index;
        const [_match, skip, role] = match;
        // 0 2 4 6 8 10 13 16 19
        // * Hiero does something.
        //   \......,\.......
        // do(role="hiero") does something
        const pre = 'do(role="';
        const post = '")';

        s.update(
          offset + skip.length,
          offset + skip.length + role.length,
          lowerCaseFirstLetter(role)
        );
        s.appendRight(offset + skip.length + role.length, post);
        s.remove(offset, offset + skip.length);
        s.prependLeft(offset, pre);
      }
      return s.toString();
    },
    decorate(add, from, to, match, view) {
      const { groups } = match;
      if (!groups) return;
      add(
        from + groups.skip.length,
        Math.min(to, from + groups.role.length + 2),
        Decoration.mark(roleSpec)
      );
    },
  },
  {
    name: "grade",
    regexp: /^( *)(.*)\b(\d{1,2}=\d{1,2})\b/gm,
    transform(input: string, s: MagicString, source: string) {
      const matches = input.matchAll(this.regexp);
      for (const match of matches) {
        const offset = match.index;
        const [_match, indent, pre, grade] = match;
        if (pre.endsWith('grade(grade="')) return input;
        const out =
          indent +
          pre +
          ["", "|", `grade(grade="${grade}")`, "|", "| "].join(
            "\n" + indent + "  "
          );

        s.appendRight(
          offset + indent.length + pre.length + grade.length,
          ['")', "|", "|"].join("\n" + indent + "  ")
        );
        s.prependLeft(
          offset + indent.length + pre.length,
          ["", "|", 'grade(grade="'].join("\n" + indent + "  ")
        );
      }
      return s.toString();
    },
  },
  {
    name: "var",
    regexp:
      /^(?<indent> *)(?<pre>.*)\$\{(?<varName>\w+);?(?<args>[\w,=]*)\}(?<space> )?/gm,
    transform(input: string, s: MagicString, source: string) {
      const matches = input.matchAll(this.regexp);
      for (const match of matches) {
        const offset = match.index;
        const [_match, indent, pre, varName, args, space] = match;
        s.remove(
          // }
          offset + indent.length + pre.length + varName.length + 2,
          offset +
            indent.length +
            pre.length +
            varName.length +
            (args.length ? args.length + 1 : 0) +
            3
        );
        s.appendRight(
          offset + indent.length + pre.length + varName.length + 2,
          ['")', "|", space && "|"].join("\n" + indent + "  ")
        );
        s.prependLeft(
          offset + indent.length + pre.length,
          (args === "b"
            ? ["", "|", "b", '  var(name="']
            : ["", "|", 'var(name="']
          ).join("\n" + indent + "  ")
        );
        s.remove(
          // ${
          offset + indent.length + pre.length,
          offset + indent.length + pre.length + 2
        );
      }
      return s.toString();
    },
    decorate(add, from, to, match, view) {
      const { groups } = match;
      if (!groups) return;
      add(
        from + groups.indent.length + groups.pre.length,
        to,
        // theme "var" token color
        Decoration.mark({ attributes: { style: "color: #c678dd" } })
      );
    },
  },
];

export async function trace(sourceMaps, line, column) {
  let pos = { line, column };
  for (const sourceMap of sourceMaps.toReversed()) {
    const consumer = await new SourceMapConsumer(sourceMap);
    pos = consumer.originalPositionFor(pos);
  }
  return pos;
}

export function transformAndMapShortcuts(input: string) {
  let transformed = input;

  let prev;
  const sourceMaps: string[] = [];
  for (let i = 0; i < shortcuts.length; i++) {
    const file = "result" + i + ".pug";
    if (!prev) prev = "source.pug";
    const s = new MagicString(transformed);
    transformed = shortcuts[i].transform(transformed, s, prev);
    // console.log("transformed", transformed);
    sourceMaps.push(
      s.generateMap({ source: prev, file, hires: true }).toString()
    );
    prev = file;
  }

  // NB: reverse() mutates, in case we need it again.
  // toReversed() not common in older node versions.
  const remapped = remapping(sourceMaps.reverse(), () => null);
  return {
    transformed,
    sourceMap: remapped,
    // sourceMaps,
  };
}

const shortcutDecorators = shortcuts
  .toReversed()
  .filter(({ decorate }) => decorate)
  .map(({ regexp, decorate }) => new MatchDecorator({ regexp, decorate }))
  .concat([
    new MatchDecorator({
      regexp: /role="([A-Za-z,-]+)"/g,
      decorate(add, from, to, match, view) {
        add(from + 6, to - 1, Decoration.mark(roleSpec));
      },
    }),
  ]);

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
