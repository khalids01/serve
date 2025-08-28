"use client";

import { useState } from "react";
import { Code, Book, Zap } from "lucide-react";
import { PublicHeader } from "@/components/core/public-header";
import { GettingStartedSection } from "@/features/docs/sections/getting-started";
import { AuthenticationSection } from "@/features/docs/sections/authentication";
import { UploadImageSection } from "@/features/docs/sections/upload-image";
import { ListImagesSection } from "@/features/docs/sections/list-images";
import { GetImageSection } from "@/features/docs/sections/get-image";
import { DeleteImageSection } from "@/features/docs/sections/delete-image";

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    { id: "getting-started", title: "Getting Started", icon: Book },
    { id: "authentication", title: "Authentication", icon: Zap },
    { id: "upload", title: "Upload Image", icon: Code },
    { id: "list", title: "List Images", icon: Code },
    { id: "get", title: "Get Image", icon: Code },
    { id: "delete", title: "Delete Image", icon: Code },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Docs Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Serve API</h1>
              <p className="text-muted-foreground">
                Fast, secure file storage API
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-8">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {section.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Getting Started */}
            {activeSection === "getting-started" && <GettingStartedSection />}

            {/* Authentication */}
            {activeSection === "authentication" && <AuthenticationSection />}

            {/* Upload Image */}
            {activeSection === "upload" && <UploadImageSection />}

            {/* List Images */}
            {activeSection === "list" && <ListImagesSection />}

            {/* Get Image */}
            {activeSection === "get" && <GetImageSection />}

            {/* Delete Image */}
            {activeSection === "delete" && <DeleteImageSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
