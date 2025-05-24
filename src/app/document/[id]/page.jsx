"use client";

import Editor from "@/components/features/editor/Editor";
import { Room } from "@/components/Room";
import Spinner from "@/components/common/Spinner";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const EditorPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState({});
  

  useEffect(() => {
    const recordAccess = async () => {
      if (id) {
        try {
          await fetch("/api/document/access", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ documentId: id }),
          });
        } catch (error) {
          console.error("Error recording document access:", error);
        }
      }
    };

    recordAccess();
  }, [id]);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/document/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "An error occurred while fetching title");
        }

        setDocument(data);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDocument();
  }, [id]);

  return (
    <div className="bg-gray-50 min-h-screen w-full px-40 py-20">
      <Suspense fallback={<Spinner />}>
        <Room id={id}>
          <Editor template={document.template} />
        </Room>
      </Suspense>
    </div>
  );
};

export default EditorPage;
