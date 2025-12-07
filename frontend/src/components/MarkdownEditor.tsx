"use client";

import { memo } from "react";
import { useIsMobile } from "@/features/devlogs/hooks/useIsMobile";
import { useResizableWidth } from "@/features/devlogs/hooks/useResizableWidth";
import ReactMarkdown from "react-markdown";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { CreateDevlogDTO } from "@/features/devlogs/schemas/createDevlog.schema";


interface ContentErrors extends Pick<CreateDevlogDTO, "content"> { }

interface MarkdownEditorProps {
    register: UseFormRegister<any>;
    watch: UseFormWatch<any>;
    errors: FieldErrors<ContentErrors>;
}

export function MarkdownEditor({ register, watch, errors }: MarkdownEditorProps) {
    const isMobile = useIsMobile();

    const { width: leftWidth, containerRef, startResizing } = useResizableWidth(50);

    const watchedContent = watch("content");

    const Preview = memo(({ content }: { content: string }) => {
        return <ReactMarkdown>{content}</ReactMarkdown>;
    });



    return (
        <div ref={containerRef} className="min-h-96 flex-1 w-full flex flex-col sm:flex-row relative overflow-hidden rounded-xl border border-gray-300">
            <div className="sm:h-full h-1/2 flex flex-col" style={{ width: isMobile ? "100%" : `${leftWidth}%` }}>
                <div className="bg-gray-100 p-2 text-sm font-semibold text-muted border-b">Markdown</div>
                <textarea
                    placeholder="Write your devlog entry content..."
                    {...register("content")}
                    className="w-full h-full p-4 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    spellCheck={false}
                />
                {errors.content && <p className="text-danger text-sm p-2">{errors.content.message}</p>}
            </div>

            <div onMouseDown={startResizing} className="w-0 sm:w-2 bg-gray-300 cursor-col-resize hover:bg-primary transition duration-300" />

            <div className="flex-1 flex flex-col sm:h-full h-1/2" style={{ width: isMobile ? "100%" : `${100 - leftWidth}%` }}>
                <div className="bg-gray-100 p-2 text-sm font-semibold text-muted border-b">Preview</div>
                <div className="flex-1 overflow-y-auto p-6 prose max-w-none break-words">
                    <Preview content={watchedContent} />
                </div>
            </div>
        </div>
    )
}
