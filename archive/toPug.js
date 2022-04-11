function toPug(node, indent = 0) {
  //const obj = {}, attrs = [];
  let str = node.type;
  const attrs = [];

  if (node.type === "task") {
    attrs.push({ name: "role", val: node.role });
    if (node.do) str = "do";
    if (node.say) str = "say";
    node.text = node.do || node.say;
    if (typeof node.text !== "string") delete node.text;
  } else if (node.type === "text") {
    str = "|";
    node.text = node.value;
  } else if (node.type === "title") {
    node.text = node.value;
  } else if (node.type === "todo") {
    node.text = node.title;
  } else if (node.type === "note") {
    node.text = node.value;
  } else if (node.type === "var") {
    attrs.push({ name: "name", val: node.name });
  }

  if (attrs.length)
    str +=
      "(" +
      attrs.map(({ name, val }) => name + "='" + val + "'").join(",") +
      ")";

  if (node.text) {
    if (str.length + node.text.length > 80) {
      // https://stackoverflow.com/a/51506718/1839099
      const wrap = (s, w) =>
        s.replace(
          new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, "g"),
          "$1\n"
        );
      str +=
        "\n" +
        " ".repeat(indent + 2) +
        "| " +
        wrap(node.text, 80)
          .split("\n")
          .join("\n" + " ".repeat(indent + 2) + "| ");
    } else str += " " + node.text;
  }

  if (node.children)
    str +=
      "\n" +
      " ".repeat(indent + 2) +
      node.children
        .map((n) => toPug(n, indent + 2))
        .join("\n" + " ".repeat(indent + 2));

  return str;
}

// console.log(toPug({ children: neophyte }));
