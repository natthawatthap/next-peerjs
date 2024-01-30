
import Link from "next/link";

export default function Home() {
  return (
    <main >
      <Link href="/streamer">
        <button>Go to Streamer</button>
      </Link>

      <Link href="/subscriber">
        <button>Go to Subscriber</button>
      </Link>
    </main>
  );
}
