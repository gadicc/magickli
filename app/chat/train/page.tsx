"use client";

import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";

export default function Home() {
  return (
    <main>
      <div className="items-center justify-between p-24">
        <FilePond
          allowMultiple={false}
          credits={false}
          server={{
            url: "/chat/train/upload",
          }}
        />
      </div>
    </main>
  );
}
