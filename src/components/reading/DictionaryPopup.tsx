"use client";

import { useEffect, useState, useRef } from "react";
import { X, Volume2, Loader2, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DictionaryData {
  word: string;
  pronunciation: {
    ipa: string | null;
    audio: string | null;
  };
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example: string | null;
    }[];
  }[];
}

interface DictionaryPopupProps {
  word: string;
  position: { x: number; y: number };
  onClose: () => void;
}

// Supported languages for translation
const LANGUAGES = [
  { code: "tr", name: "Turkish" },
  { code: "az", name: "Azerbaijani" },
  { code: "ru", name: "Russian" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ar", name: "Arabic" },
  { code: "zh-CN", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
];

async function getEnglishWordData(word: string): Promise<DictionaryData> {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Word not found");
  }

  const data = await response.json();
  const entry = data[0];

  // IPA pronunciation
  const ipa = entry.phonetics?.find((p: { text?: string }) => p.text)?.text || null;

  // Audio pronunciation - prefer US or UK audio
  const audioEntry = entry.phonetics?.find(
    (p: { audio?: string }) => p.audio && p.audio.length > 0
  );
  const audio = audioEntry?.audio || null;

  // Meanings
  const meanings = entry.meanings.map(
    (meaning: {
      partOfSpeech: string;
      definitions: { definition: string; example?: string }[];
    }) => ({
      partOfSpeech: meaning.partOfSpeech,
      definitions: meaning.definitions.slice(0, 3).map((def) => ({
        definition: def.definition,
        example: def.example || null,
      })),
    })
  );

  return {
    word: entry.word,
    pronunciation: {
      ipa,
      audio,
    },
    meanings,
  };
}

async function translateText(text: string, targetLang: string): Promise<string> {
  // Using MyMemory Translation API - free, no API key required
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Translation failed");
  }

  const data = await response.json();

  if (data.responseStatus !== 200 && data.responseStatus !== "200") {
    throw new Error("Translation failed");
  }

  return data.responseData.translatedText;
}

export const DictionaryPopup = ({ word, position, onClose }: DictionaryPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DictionaryData | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Translation state
  const [targetLanguage, setTargetLanguage] = useState(() => {
    // Get saved language preference or default to Turkish (SSR safe)
    if (typeof window !== "undefined") {
      return localStorage.getItem("dictionary-target-language") || "tr";
    }
    return "tr";
  });
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Check if mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  // Calculate position to keep popup in viewport
  const getAdjustedPosition = () => {
    if (typeof window === "undefined") {
      return { x: position.x, y: position.y };
    }

    const padding = 12;

    // On mobile, center the popup horizontally
    if (isMobile) {
      return {
        x: padding,
        y: Math.min(position.y + 10, window.innerHeight * 0.15),
      };
    }

    const popupWidth = 400;
    const popupHeight = 450;

    let x = position.x - popupWidth / 2;
    let y = position.y + 10;

    // Adjust horizontal position
    if (x + popupWidth > window.innerWidth - padding) {
      x = window.innerWidth - popupWidth - padding;
    }
    if (x < padding) {
      x = padding;
    }

    // Adjust vertical position - show above if no space below
    if (y + popupHeight > window.innerHeight - padding) {
      y = position.y - popupHeight - 10;
    }
    if (y < padding) {
      y = padding;
    }

    return { x, y };
  };

  const adjustedPosition = getAdjustedPosition();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Don't close if clicking inside the popup
      if (popupRef.current && popupRef.current.contains(target)) {
        return;
      }

      // Don't close if clicking on Select dropdown (rendered in portal)
      if (
        target.closest("[data-radix-select-viewport]") ||
        target.closest("[data-radix-select-content]") ||
        target.closest('[role="listbox"]') ||
        target.closest('[role="option"]')
      ) {
        return;
      }

      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Fetch dictionary data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getEnglishWordData(word);
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setError("Word not found in dictionary");
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [word]);

  // Fetch translation when word or target language changes
  useEffect(() => {
    let isMounted = true;

    const fetchTranslation = async () => {
      setIsTranslating(true);
      setTranslationError(null);

      try {
        const result = await translateText(word, targetLanguage);
        if (isMounted) {
          setTranslation(result);
          setIsTranslating(false);
        }
      } catch {
        if (isMounted) {
          setTranslationError("Translation unavailable");
          setIsTranslating(false);
        }
      }
    };

    fetchTranslation();

    return () => {
      isMounted = false;
    };
  }, [word, targetLanguage]);

  const handleLanguageChange = (lang: string) => {
    setTargetLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("dictionary-target-language", lang);
    }
  };

  const playAudio = () => {
    if (data?.pronunciation.audio && audioRef.current) {
      setIsPlayingAudio(true);
      audioRef.current.play();
    }
  };

  const selectedLanguageName =
    LANGUAGES.find((l) => l.code === targetLanguage)?.name || "Turkish";

  return (
    <div
      ref={popupRef}
      className="fixed z-[9999] bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        width: isMobile ? `calc(100vw - 24px)` : 400,
        maxHeight: isMobile ? "70vh" : "75vh",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-1 h-5 bg-primary rounded-full flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-foreground text-base sm:text-lg truncate">
              {word}
            </h4>
            {data?.pronunciation.ipa && (
              <span className="text-xs sm:text-sm text-muted-foreground">
                {data.pronunciation.ipa}
              </span>
            )}
          </div>
          {data?.pronunciation.audio && (
            <>
              <audio
                ref={audioRef}
                src={data.pronunciation.audio}
                onEnded={() => setIsPlayingAudio(false)}
                onError={() => setIsPlayingAudio(false)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={playAudio}
                disabled={isPlayingAudio}
                className="h-8 w-8 hover:bg-primary/10 hover:text-primary flex-shrink-0"
              >
                <Volume2
                  className={`h-4 w-4 ${isPlayingAudio ? "animate-pulse text-primary" : ""}`}
                />
              </Button>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Translation Section */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border bg-primary/5">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Languages className="h-4 w-4 text-primary flex-shrink-0" />
            {isTranslating ? (
              <span className="text-xs sm:text-sm text-muted-foreground">
                Translating...
              </span>
            ) : translationError ? (
              <span className="text-xs sm:text-sm text-muted-foreground">
                {translationError}
              </span>
            ) : (
              <span className="text-sm sm:text-base font-medium text-foreground truncate">
                {translation}
              </span>
            )}
          </div>
          <Select value={targetLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger
              className="w-[100px] sm:w-[130px] h-8 text-xs flex-shrink-0"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <SelectValue placeholder={selectedLanguageName} />
            </SelectTrigger>
            <SelectContent
              className="z-[10000]"
              position="popper"
              sideOffset={5}
              onPointerDownOutside={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="text-sm">
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-3 sm:p-4">
          {isLoading && (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-primary" />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Looking up definition...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <p className="text-xs sm:text-sm text-muted-foreground">{error}</p>
            </div>
          )}

          {data && !isLoading && !error && (
            <div className="space-y-3 sm:space-y-4">
              {data.meanings.map((meaning, meaningIndex) => (
                <div key={meaningIndex} className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {meaning.partOfSpeech}
                    </span>
                  </div>
                  <div className="space-y-2 sm:space-y-3 pl-1">
                    {meaning.definitions.map((def, defIndex) => (
                      <div key={defIndex} className="space-y-1">
                        <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                          <span className="text-muted-foreground mr-1.5 sm:mr-2">
                            {defIndex + 1}.
                          </span>
                          {def.definition}
                        </p>
                        {def.example && (
                          <p className="text-xs sm:text-sm text-muted-foreground italic pl-3 sm:pl-4 border-l-2 border-muted leading-relaxed">
                            &quot;{def.example}&quot;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
