import { useMemo, useState, type ChangeEvent } from "react";
import { useAppState } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, CheckCircle2, MapPin, Search, Upload, Copy, Share2, Trash2, LocateFixed, Users, AlertTriangle, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { locations } from "@/data/demoData";
import { uploadFeedbackPhotosToCloud } from "@/integrations/supabase/dataSync";

const departmentOptions = [
  "Water Board",
  "Roads & Transport",
  "Health Department",
  "Sanitation",
  "Education",
  "Police",
  "Electricity",
  "Housing",
  "Other",
];

export default function SubmitFeedback() {
  const { addCitizenFeedback, submissions } = useAppState();
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [department, setDepartment] = useState("Water Board");
  const [otherDepartment, setOtherDepartment] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [locationQuery, setLocationQuery] = useState(locations[0]);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [streetAddress, setStreetAddress] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [raisedFeedbackNames, setRaisedFeedbackNames] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem("govsense:raised-feedback-names");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [expandedFeedbackNames, setExpandedFeedbackNames] = useState<string[]>([]);

  const resolvedDepartment = department === "Other" ? otherDepartment.trim() : department;
  const resolvedLocation = [selectedLocation, streetAddress.trim()].filter(Boolean).join(", ");
  const filteredLocations = locations.filter((item) => item.toLowerCase().includes(locationQuery.toLowerCase().trim()));
  const mapsEmbedUrl = resolvedLocation
    ? `https://www.google.com/maps?q=${encodeURIComponent(resolvedLocation)}&output=embed`
    : "";

  const portalUrl = typeof window !== "undefined" ? window.location.origin : "";

  const shareMessage = `Please use this citizen portal to report local civic issues and raise them with government departments: ${portalUrl}`;
  const raisedFeedbackSet = useMemo(() => new Set(raisedFeedbackNames), [raisedFeedbackNames]);

  const priorityRank = useMemo(() => ({ Critical: 4, High: 3, Medium: 2, Low: 1 } as const), []);

  const publicFeedbackByCitizen = useMemo(() => {
    const byCitizen = new Map<
      string,
      {
        count: number;
        topPriority: "Low" | "Medium" | "High" | "Critical";
        highPriorityCount: number;
        latestDomain: string;
        latestLocation: string;
        latestComment: string;
        latestDate: string;
      }
    >();

    for (const item of submissions) {
      const nameLabel = item.citizenName?.trim() || "Anonymous Citizen";
      const existing = byCitizen.get(nameLabel) ?? {
        count: 0,
        topPriority: "Low" as const,
        highPriorityCount: 0,
        latestDomain: item.domain,
        latestLocation: item.location,
        latestComment: item.text,
        latestDate: item.date,
      };
      const topPriority = priorityRank[item.urgency] > priorityRank[existing.topPriority] ? item.urgency : existing.topPriority;
      const isLatest = item.date >= existing.latestDate;

      byCitizen.set(nameLabel, {
        count: existing.count + 1,
        topPriority,
        highPriorityCount: existing.highPriorityCount + (item.urgency === "High" || item.urgency === "Critical" ? 1 : 0),
        latestDomain: isLatest ? item.domain : existing.latestDomain,
        latestLocation: isLatest ? item.location : existing.latestLocation,
        latestComment: isLatest ? item.text : existing.latestComment,
        latestDate: isLatest ? item.date : existing.latestDate,
      });
    }

    return [...byCitizen.entries()]
      .map(([nameLabel, data]) => ({ nameLabel, ...data }))
      .sort((a, b) => {
        const aCount = a.count + (raisedFeedbackSet.has(a.nameLabel) ? 1 : 0);
        const bCount = b.count + (raisedFeedbackSet.has(b.nameLabel) ? 1 : 0);
        if (bCount !== aCount) return bCount - aCount;
        return priorityRank[b.topPriority] - priorityRank[a.topPriority];
      })
      .slice(0, 8);
  }, [submissions, priorityRank, raisedFeedbackSet]);

  const handleToggleRaiseFeedback = (personName: string) => {
    setRaisedFeedbackNames((prev) => {
      const next = prev.includes(personName)
        ? prev.filter((name) => name !== personName)
        : [...prev, personName];

      if (typeof window !== "undefined") {
        window.localStorage.setItem("govsense:raised-feedback-names", JSON.stringify(next));
      }
      return next;
    });
  };

  const toggleFeedbackDetails = (personName: string) => {
    setExpandedFeedbackNames((prev) =>
      prev.includes(personName) ? prev.filter((name) => name !== personName) : [...prev, personName],
    );
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (!imageFiles.length) {
      toast({ title: "No valid images", description: "Please upload image files only (jpg, png, webp)." });
      return;
    }

    const remainingSlots = Math.max(0, 3 - photos.length);
    const selected = imageFiles.slice(0, remainingSlots);

    const encoded = await Promise.all(
      selected.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error("Unable to read selected image"));
            reader.readAsDataURL(file);
          }),
      ),
    );

    setPhotos((prev) => [...prev, ...encoded]);

    if (imageFiles.length > remainingSlots) {
      toast({ title: "Photo limit reached", description: "You can attach up to 3 photos per issue." });
    }

    event.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopyPortalLink = async () => {
    if (!portalUrl) return;
    try {
      await navigator.clipboard.writeText(portalUrl);
      toast({ title: "Portal link copied", description: "Share it with friends to raise more issues." });
    } catch {
      toast({ title: "Copy failed", description: "Please copy the URL from your browser address bar." });
    }
  };

  const handleNativeShare = async () => {
    if (!portalUrl) return;
    if (!navigator.share) {
      await handleCopyPortalLink();
      return;
    }

    try {
      await navigator.share({
        title: "Citizen Issue Reporting Portal",
        text: "Join this portal to raise civic issues with local departments.",
        url: portalUrl,
      });
    } catch {
      // Ignore cancellation and unsupported share channel errors.
    }
  };

  const findBestLocationMatch = (source: string): string | null => {
    const normalized = source.toLowerCase();

    const aliasHints: Record<string, string> = {
      bangalore: "Bengaluru Urban",
      bengaluru: "Bengaluru Urban",
      mysore: "Mysuru (Mysore)",
      mysuru: "Mysuru (Mysore)",
      mangalore: "Dakshina Kannada",
      mangaluru: "Dakshina Kannada",
      hubli: "Dharwad",
      dharwad: "Dharwad",
      tumkur: "Tumakuru",
      tumakuru: "Tumakuru",
      bellary: "Ballari (Bellary)",
      ballari: "Ballari (Bellary)",
      gulbarga: "Kalaburagi (Gulbarga)",
      kalaburagi: "Kalaburagi (Gulbarga)",
      bijapur: "Vijayapura (Bijapur)",
      vijayapura: "Vijayapura (Bijapur)",
    };

    for (const [key, mapped] of Object.entries(aliasHints)) {
      if (normalized.includes(key)) return mapped;
    }

    const direct = locations.find((item) => normalized.includes(item.toLowerCase()));
    return direct ?? null;
  };

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", description: "Your browser does not support location access.", variant: "destructive" });
      return;
    }

    setLocating(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        });
      });

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      let displayAddress = `Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`;
      let locationLabel = selectedLocation;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (response.ok) {
          const payload = await response.json() as {
            display_name?: string;
            address?: Record<string, string | undefined>;
          };

          if (payload.display_name) displayAddress = payload.display_name;

          const searchText = [
            payload.display_name,
            payload.address?.city,
            payload.address?.state_district,
            payload.address?.state,
            payload.address?.county,
          ].filter(Boolean).join(" ");

          const matched = findBestLocationMatch(searchText);
          if (matched) {
            locationLabel = matched;
          }
        }
      } catch {
        // Keep coordinate fallback if reverse geocoding fails.
      }

      setStreetAddress(displayAddress);
      setSelectedLocation(locationLabel);
      setLocationQuery(locationLabel);

      toast({ title: "Location captured", description: "Your current location has been added automatically." });
    } catch {
      toast({
        title: "Unable to fetch location",
        description: "Please allow location permission or enter the address manually.",
        variant: "destructive",
      });
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !text.trim() || !resolvedDepartment) return;
    setSubmitting(true);

    let uploadedPhotos = photos;
    if (photos.length > 0) {
      try {
        uploadedPhotos = await uploadFeedbackPhotosToCloud(photos);
      } catch {
        toast({
          title: "Photo upload issue",
          description: "Photos could not be uploaded to cloud right now. Feedback will still be submitted.",
          variant: "destructive",
        });
      }
    }

    addCitizenFeedback({
      citizenName: name.trim(),
      text: text.trim(),
      department: resolvedDepartment,
      phoneNumber: phoneNumber.trim(),
      photos: uploadedPhotos,
      location: resolvedLocation || "Not specified",
      date,
    });
    setSubmitted(true);
    setSubmitting(false);
    toast({
      title: "Feedback submitted",
      description: "Your feedback has been securely recorded and forwarded for admin review.",
    });
  };

  const handleReset = () => {
    setName("");
    setText("");
    setDepartment("Water Board");
    setOtherDepartment("");
    setPhoneNumber("");
    setLocationQuery(locations[0]);
    setSelectedLocation(locations[0]);
    setStreetAddress("");
    setPhotos([]);
    setDate(new Date().toISOString().split("T")[0]);
    setSubmitted(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submit Feedback</h1>
        <p className="text-muted-foreground mt-1">Citizens can submit service feedback for secure government review.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Citizen Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={submitted}
          />
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitted}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select value={department} onValueChange={setDepartment} disabled={submitted}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {department === "Other" && (
              <Input
                placeholder="Enter department name"
                value={otherDepartment}
                onChange={(e) => setOtherDepartment(e.target.value)}
                disabled={submitted}
              />
            )}
          </div>
          <Input
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={submitted}
          />
          <Textarea
            placeholder="Describe your feedback about government services..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px]"
            disabled={submitted}
          />
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locality or area"
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setSelectedLocation(e.target.value);
                }}
                className="pl-9"
                disabled={submitted}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={handleUseMyLocation}
              disabled={submitted || locating}
            >
              <LocateFixed className="h-4 w-4" /> {locating ? "Detecting Location..." : "Use My Location"}
            </Button>
            {!submitted && locationQuery.trim() && filteredLocations.length > 0 && (
              <div className="max-h-44 overflow-auto rounded-md border bg-card shadow-sm">
                {filteredLocations.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                    onClick={() => {
                      setLocationQuery(item);
                      setSelectedLocation(item);
                    }}
                  >
                    <span>{item}</span>
                    <span className="text-xs text-muted-foreground">Select</span>
                  </button>
                ))}
              </div>
            )}
            <Input
              placeholder="Full address: house number, street, 1st cross, landmark"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              disabled={submitted}
            />
          </div>

          <div className="space-y-2 rounded-lg border p-3 bg-muted/20">
            <p className="text-sm font-medium">Attach Photos (optional)</p>
            <p className="text-xs text-muted-foreground">Add up to 3 photos to document the issue clearly.</p>
            <Input
              type="file"
              accept="image/*"
              multiple
              disabled={submitted || submitting || photos.length >= 3}
              onChange={handlePhotoChange}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo, idx) => (
                <div key={photo.slice(0, 48) + idx} className="relative rounded-md border overflow-hidden">
                  <img src={photo} alt={`Issue evidence ${idx + 1}`} className="h-28 w-full object-cover" />
                  {!submitted && (
                    <button
                      type="button"
                      aria-label="Remove photo"
                      className="absolute top-1 right-1 rounded bg-black/70 text-white p-1 hover:bg-black"
                      onClick={() => removePhoto(idx)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {!submitted && photos.length < 3 && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Upload className="h-3 w-3" /> {3 - photos.length} upload slot(s) remaining
              </p>
            )}
          </div>

          {resolvedLocation && mapsEmbedUrl && (
            <div className="space-y-2 rounded-lg border p-3 bg-muted/20">
              <p className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" /> Google Map Preview
              </p>
              <p className="text-xs text-muted-foreground">{resolvedLocation}</p>
              <iframe
                title="Google map preview"
                src={mapsEmbedUrl}
                className="h-56 w-full rounded-md border"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}

          {!submitted ? (
            <Button onClick={handleSubmit} disabled={submitting || !name.trim() || !text.trim() || !resolvedDepartment || !resolvedLocation} className="gap-2">
              <Send className="h-4 w-4" /> {submitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Feedback submitted successfully</span>
              <Button variant="outline" className="ml-auto" onClick={handleReset}>Submit Another</Button>
            </div>
          )}

          <div className="space-y-2 rounded-lg border p-3 bg-muted/20">
            <p className="text-sm font-medium">Share Portal With Friends</p>
            <p className="text-xs text-muted-foreground">Encourage more citizens to report issues so departments can prioritize action faster.</p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="gap-2" onClick={handleNativeShare}>
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button type="button" variant="outline" className="gap-2" onClick={handleCopyPortalLink}>
                <Copy className="h-4 w-4" /> Copy Link
              </Button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button type="button" variant="outline">Share on WhatsApp</Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" /> Public Feedback Snapshot
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Citizens who shared feedback, with submission count and top priority.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {publicFeedbackByCitizen.length === 0 ? (
            <p className="text-sm text-muted-foreground">No public feedback available yet.</p>
          ) : (
            publicFeedbackByCitizen.map((item) => (
              <div key={item.nameLabel} className="rounded-md border overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 p-3 text-left hover:bg-muted/40"
                  onClick={() => toggleFeedbackDetails(item.nameLabel)}
                >
                  <div>
                    <p className="text-sm font-medium">{item.nameLabel}</p>
                    <p className="text-xs text-muted-foreground">Shared count: {item.count + (raisedFeedbackSet.has(item.nameLabel) ? 1 : 0)}</p>
                    <p className="text-xs text-muted-foreground">High/Critical: {item.highPriorityCount}</p>
                    <p className="text-xs text-muted-foreground mt-1">Click to verify domain, location, and comment before raising.</p>
                  </div>
                  <Badge variant={item.topPriority === "Critical" ? "destructive" : "outline"} className="gap-1 shrink-0">
                    <AlertTriangle className="h-3 w-3" /> {item.topPriority}
                    <ChevronDown className={`h-3 w-3 transition-transform ${expandedFeedbackNames.includes(item.nameLabel) ? "rotate-180" : ""}`} />
                  </Badge>
                </button>

                {expandedFeedbackNames.includes(item.nameLabel) && (
                  <div className="border-t bg-muted/20 p-3 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="rounded-md bg-background p-2 border">
                        <p className="text-muted-foreground">Domain</p>
                        <p className="font-medium">{item.latestDomain}</p>
                      </div>
                      <div className="rounded-md bg-background p-2 border">
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">{item.latestLocation}</p>
                      </div>
                    </div>
                    <div className="rounded-md bg-background p-2 border text-xs">
                      <p className="text-muted-foreground">Comment</p>
                      <p className="font-medium leading-5">{item.latestComment}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground">Verified from the latest public submission by this citizen.</p>
                      <Button
                        type="button"
                        size="sm"
                        variant={raisedFeedbackSet.has(item.nameLabel) ? "secondary" : "outline"}
                        onClick={() => handleToggleRaiseFeedback(item.nameLabel)}
                      >
                        {raisedFeedbackSet.has(item.nameLabel) ? "Unraise" : "Raise"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
