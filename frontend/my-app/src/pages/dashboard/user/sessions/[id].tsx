import Navbar from "@/components/navbar/Navbar2";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserSessions() {
  const router = useRouter();
  const { id } = router.query;
  const [listenerId, setListenerId] = useState<string | string[] | undefined>(
    undefined
  );

  useEffect(() => {
    if (id) {
      setListenerId(id);
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <p>Listener ID: {listenerId}</p>
      </div>
    </>
  );
}
