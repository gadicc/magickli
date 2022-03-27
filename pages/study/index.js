import React from "react";

import Link from "../../src/Link.js";
import AppBar from "../../components/AppBar.js";

export default function Study() {
  return (
    <div>
      <AppBar title="Study" />
      <h1>Current Sets</h1>
      <h1>All Sets</h1>
      <Link href="/study/zodiac-signs">zodiac-signs</Link>
    </div>
  );
}
